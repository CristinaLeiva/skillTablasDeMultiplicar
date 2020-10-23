//Esta skill ayuda a aprender las tablas de multiplicar
//   NIVEL BÁSICO: Alexa pregunta aleatoriamente la tabla de multiplicar que el usuario le indica. Si acierta --> Felicita. Sino --> Devuelve resultado y anima a continuar.
//   NIVEL AVANZADO: Alexa pregunta aleatoriamente cualquier tabla de multiplicar. Si acierta --> Felicita. Sino --> Devuelve resultado y anima a continuar.
//   NIVEL EXPERTO: Alexa pregunta aleatoriamente cualquier tabla de multiplicar. Si acierta --> Felicita. Sino --> Devuelve resultado y anima a continuar.
//   OTRAS OPCIONES DE DESARROLLO:
//      - Qué el usuario diga una tabla y Alexa le diga si es correcta.
//      - Sistema de puntos para motivar.
//      - Multiplicaciones de dos cifras por una cifra.
//Permisos necesarios:
//  Acceso al nombre de usuario del dispositivo únicamente para hacer más personal la skill, nunca se utilizará para otros fines ni para cederla a terceros.

const Alexa = require('ask-sdk-core');
const persistence = require('./persistence');
const interceptors = require('./interceptors');
const logic = require('./logic');
const constants = require('./constants');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        if(!sessionAttributes['name']){
            // let's try to get the given name via the Customer Profile API
            // don't forget to enable this permission in your skill configuratiuon (Build tab -> Permissions)
            // or you'll get a SessionEndedRequest with an ERROR of type INVALID_RESPONSE
            try {
                const {permissions} = requestEnvelope.context.System.user;
                if(!permissions)
                    throw { statusCode: 401, message: 'No permissions available' }; // there are zero permissions, no point in intializing the API
                const upsServiceClient = serviceClientFactory.getUpsServiceClient();
                const profileName = await upsServiceClient.getProfileGivenName();
                if (profileName) { // the user might not have set the name
                  //save to session and persisten attributes
                  sessionAttributes['name'] = profileName;
                }

            } catch (error) {
                console.log(JSON.stringify(error));
                if (error.statusCode === 401 || error.statusCode === 403) {
                  // the user needs to enable the permissions for given name, let's send a silent permissions card.
                  handlerInput.responseBuilder.withAskForPermissionsConsentCard(constants.GIVEN_NAME_PERMISSION);
                }
            }
        }

        const name = sessionAttributes['name'] ? sessionAttributes['name'] + '. ' : '';

        let speechText = handlerInput.t('WELCOME_MSG', {name: name});
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
};

//el usuario dice "la tabla del 3" o "quiero practicar la tabla del 3"
const PreguntaLaTablaIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'PreguntaLaTablaIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        
        const num_tabla = intent.slots.num_tabla.value;
        const factor1 = num_tabla;
        const factor2 = (Math.floor(Math.random() * (10 - 0)) + 0);
        
        sessionAttributes['factor1'] = factor1;
        sessionAttributes['factor2'] = factor2;
        
        const speechText = handlerInput.t('PREGUNTA_LA_TABLA_MSG', {num_tabla: num_tabla});

        return handlerInput.responseBuilder
            .speak(speechText + handlerInput.t('LINEA_DE_TABLA_MSG', {factor1: factor1, factor2: factor2}))
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
};

//el usuario dice la respuesta a la pregunta, por ejemplo "9"
const RespuestaUsuarioIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RespuestaUsuarioIntent';
    },
    async handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        
        let factor1 = sessionAttributes['factor1'];
        let factor2 = sessionAttributes['factor2'];
        const respuesta_correcta = factor1 * factor2;
        const respuesta_usuario = intent.slots.respuesta_usuario.value;
        
        let speechText = handlerInput.t('RESPUESTA_INCORRECTA_MSG', {respuesta_correcta: respuesta_correcta});
        if (parseInt(respuesta_correcta) === parseInt(respuesta_usuario)){
            speechText = handlerInput.t('RESPUESTA_CORRECTA_MSG');
        }
        
        //preparo la siguiente pregunta
        const factor2_next = (Math.floor(Math.random() * (10 - 0)) + 0);
        sessionAttributes['factor2'] = factor2_next;

        return handlerInput.responseBuilder
            .speak(speechText + handlerInput.t('LINEA_DE_TABLA_MSG', {factor1: factor1, factor2: factor2_next}))
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();

    }
};

//el usuario dice "quiero cambiar de tabla"
const CambiarDeTablaIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CambiarDeTablaIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        
        const name = sessionAttributes['name'] ? sessionAttributes['name'] + '. ' : '';

        let speechText = handlerInput.t('CAMBIAR_DE_TABLA_MSG', {name: name});
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const name = sessionAttributes['name'] ? sessionAttributes['name'] : '';

        const speechText = handlerInput.t('GOODBYE_MSG', {name: name});

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speechText = handlerInput.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = handlerInput.t('REFLECTOR_MSG', {intent: intentName});

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speechText = handlerInput.t('ERROR_MSG');

        console.log(`~~~~ Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        PreguntaLaTablaIntentHandler,
        RespuestaUsuarioIntentHandler,
        CambiarDeTablaIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        interceptors.LocalisationRequestInterceptor,
        interceptors.LoggingRequestInterceptor,
        interceptors.LoadAttributesRequestInterceptor)
    .addResponseInterceptors(
        interceptors.LoggingResponseInterceptor,
        interceptors.SaveAttributesResponseInterceptor)
    .withPersistenceAdapter(persistence.getPersistenceAdapter())
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();