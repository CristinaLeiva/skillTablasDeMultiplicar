//positive sound for birthday greeting from Alexa Sound Library
//https://developer.amazon.com/docs/custom-skills/ask-soundLibrary.html
const POSITIVE_SOUND = `<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_tally_positive_01"/>`; //deberíamos poder poner una dirección http donde hubiera un sonido

//congratulations greeting (speechcon)
//http://developer.amazon.com/docs/custom-skills/speechcon-reference-interjections-spanish.html
const GREETING_SPEECHCON = `<say-as interpret-as="interjection">felicidades</say-as>`;

module.exports = {
    es: {
        translation: {
            WELCOME_MSG: 'Hola {{name}} Vamos a aprender las tablas de multiplicar. Dime, ¿qué tabla quieres practicar? ',
            HELP_MSG: 'Puedes decirme: Quiero practicar la tabla del 2, por ejemplo. ',
            PREGUNTA_LA_TABLA_MSG: 'Muy bien, practiquemos la tabla del {{num_tabla}}. Si quieres cambiar de tabla di quiero cambiar de tabla. ',
            LINEA_DE_TABLA_MSG: 'Dime, ¿cuánto es {{factor1}} por {{factor2}}? ',
            RESPUESTA_CORRECTA_MSG: '¡Felicidades {{name}}! La respuesta es correcta. ',
            RESPUESTA_INCORRECTA_MSG: '¡Ohhhhh! ¡Qué pena! La respuesta correcta es {{respuesta_correcta}}. ',
            GOODBYE_MSG: ['Hasta luego {{name}}! ', 'Adios {{name}}! ', 'Hasta pronto {{name}}! ', 'Nos vemos {{name}}! '],
            CAMBIAR_DE_TABLA_MSG: 'Muy bien, cambiemos de tabla. Dime, ¿qué tabla quieres practicar ahora? '
            /*
            DAYS_LEFT_MSG: '{{name}} Queda {{count}} día ',
            DAYS_LEFT_MSG_plural: '{{name}} Quedan {{count}} días ',
            WILL_TURN_MSG: 'para que cumplas {{count}} año. ',
            WILL_TURN_MSG_plural: 'para que cumplas {{count}} años. ',
            GREET_MSG: POSITIVE_SOUND + GREETING_SPEECHCON + ' {{name}} ',
            NOW_TURN_MSG: 'Hoy cumples {{count}} año! ',
            NOW_TURN_MSG_plural: 'Hoy cumples {{count}} años! ',
            MISSING_MSG: 'Parece que aun no me has dicho tu fecha de cumpleaños. Prueba decir, registra mi cumpleaños. o dime directamente una fecha. ',
            OVERWRITE_MSG: 'Si quieres cambiar la fecha puedes decir, registra mi cumpleaños. o decirme directamente una fecha. ',
            HELP_MSG: 'Puedo recordar tu cumpleaños si me dices una fecha. Y decirte cuanto falta para que cumplas. También puedo crear un recordatorio para cuando cumplas o decirte quién cumple años hoy. ',
            REFLECTOR_MSG: 'Acabas de activar {{intent}}',
            FALLBACK_MSG: 'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez. ',
            ERROR_MSG: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez. ',
            NO_TIMEZONE_MSG: 'No he podido determinar tu zona horaria. Verifica la configuración de tu dispositivo e inténtalo otra vez.',
            REMINDER_CREATED_MSG: 'El recordatorio se ha creado con éxito. ',
            REMINDER_ERROR_MSG: 'Ha habido un error al crear el recordatorio. ',
            UNSUPPORTED_DEVICE_MSG: 'Este dispositivo no soporta la operación que estás intentando realizar. ',
            CANCEL_MSG: 'Vale. Lo cancelamos. ',
            MISSING_PERMISSION_MSG: 'Parece que no has autorizado el envío de recordatorios. Te he enviado una tarjeta a la app Alexa para que lo habilites. ',
            API_ERROR_MSG: 'Lo siento, ha habido un problema de acceso a API externa. Por favor inténtalo otra vez. ',
            PROGRESSIVE_MSG: 'Espera un momento mientras busco algunos cumpleaños de hoy. ',
            CONJUNCTION_MSG: ' y ',
            CELEBRITY_BIRTHDAYS_MSG: 'En esta fecha cumplen años: ',
            ALSO_TODAY_MSG: 'También hoy cumplen: '*/
        }
    }
}