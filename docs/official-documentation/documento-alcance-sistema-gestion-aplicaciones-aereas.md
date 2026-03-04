Documento de Alcance – Sistema de Gestión de

Aplicaciones Aéreas de Fumigación

Introducción y Alcance del Proyecto

Este documento describe el alcance inicial de una aplicación digital para gestionar fumigaciones

agrícolas aéreas (aeroaplicaciones), con miras a reemplazar procesos manuales y optimizar la

operación tanto para pilotos aplicadores como para productores. El proyecto, tentativamente llamado

FumigApp (AgriControl Pro), busca digitalizar el workflow completo de las aplicaciones: desde la

planificación de vuelos y cargamentos, registro detallado de cada aplicación (tipo de tratamiento, dosis,

campos tratados, condiciones, etc.), hasta el seguimiento post-aplicación y la facturación del servicio. La

visión a futuro es ofrecer una plataforma global, empezando por Argentina y América Latina, y

eventualmente escalando a nivel mundial. Por ello, la arquitectura se planificará desde el inicio para

soportar multi-tenant (multiempresa/multicliente) y múltiples regiones/idiomas, aun si en un principio
operará con un solo entorno productivo. Esto evitará reescrituras mayores al expandirse

geográficamente en el futuro.

En cuanto al alcance geográfico, el despliegue inicial se enfocará en una región específica de

Argentina (donde tenemos casos piloto de prueba), luego se extenderá al resto del país, América Latina,

y finalmente a un público global, adaptando idioma (español inicialmente, con soporte multilingüe

planificado) y cumplimiento normativo local en cada región. La plataforma estará construida con estas

consideraciones globales desde el día cero, por ejemplo con capacidad de manejar múltiples unidades

(hectáreas, acres) y requisitos legales como el cuaderno de campo digital obligatorio en ciertas

jurisdicciones

1

2

.

Usuarios Objetivo y Prioridades (Versión Inicial)

Si bien a largo plazo la herramienta busca atender a varios actores del sector agrícola (pilotos

aplicadores, contratistas con flotas, productores/estancias, asesores técnicos e incluso organismos

regulatorios), en la primera versión el usuario principal será el piloto aeroaplicador individual o

pequeña empresa de servicios de fumigación. Este enfoque se alinea con nuestros recursos y know-how

actuales: contamos con contacto directo con pilotos fumigadores, administradores de aeródromos

agrícolas, dueños de campo y productores, quienes pueden ofrecer retroalimentación de primera

mano. De hecho, la primera demo interna será evaluada por Mauri, un piloto fumigador experimentado

de nuestro entorno, para validar que la aplicación cubra sus necesidades operativas cotidianas.

Al priorizar al piloto, la aplicación se centrará en funcionalidades que le permitan planificar y registrar

sus trabajos de fumigación de forma sencilla, ahorrándole tiempo y papeleo. Esto incluye: gestionar

pedidos de fumigación de distintos clientes, visualizar mapas de los lotes a tratar, llevar un diario digital

de aplicaciones realizadas, calcular horas voladas y hectáreas cubiertas, registrar el consumo de

insumos (combustible, agroquímicos) y finalmente generar reportes o comprobantes para facturación

de sus servicios. En muchos casos, el piloto actúa también como contratista que cobra por su trabajo;

otras veces trabaja para un tercero. Por lo tanto, nuestra solución contemplará ambas situaciones (p.

ej., permitir registrar tanto honorarios de servicio por hora/vuelo como costos de productos químicos

aplicados cuando el piloto provee los insumos).

1

Aunque el piloto es el foco inicial, no se diseñará la plataforma de forma aislada para un solo

usuario. Desde el principio consideraremos la interacción con otros actores: por ejemplo, el cliente o

productor que contrata la fumigación deberá poder acceder a la información relevante de sus

campos y aplicaciones realizadas. Esto implica implementar un modelo de usuarios con roles o

permisos diferenciados (piloto/contratista vs. cliente/observador). De hecho, soportar múltiples

usuarios y roles es una capacidad que planeamos añadir; nuestro análisis técnico ya prevé "multi-user

support with roles" como parte de la evolución del sistema

3

4

. En versiones posteriores se podrá

escalar a contratistas con múltiples pilotos en su equipo, cooperativas agrícolas con muchos campos,

etc., pero inicialmente nos concentraremos en la dinámica piloto individual ↔ varios clientes.

Referentes y Competencia en el Mercado

Antes de detallar las funcionalidades, es importante analizar cómo la competencia y otros productos del

mercado abordan problemas similares, especialmente enfocados en el caso de pilotos

aeroaplicadores. A continuación, presentamos un benchmark de soluciones relevantes y las lecciones

que aportan:

Auravant – Plataforma de Agricultura Digital

Auravant es una plataforma integral de agricultura digital muy difundida en Latinoamérica. Ofrece

herramientas para gestión de campos, monitoreo con imágenes satelitales, mapas de rendimiento y

también un "cuaderno de campo" digital para registrar labores y aplicaciones. Si bien Auravant está

orientado principalmente a productores y agrónomos, sus funcionalidades de bitácora agrícola son un

buen referente de qué datos registrar. Por ejemplo, el cuaderno de campo de Auravant permite anotar

cada tratamiento fitosanitario con detalles como fecha de aplicación, dosis utilizada, plaga/

enfermedad objetivo, equipo empleado y nombre del aplicador responsable

2

. Estos registros

digitalizados ayudan no solo a la trazabilidad y gestión eficiente, sino también al cumplimiento de

normativas (en España, por ejemplo, desde 2023 es obligatorio llevar el cuaderno de campo en formato

digital

1

). La enseñanza para nuestro proyecto es que deberemos incluir campos similares en

nuestros registros de fumigación (producto aplicado, dosis, condiciones climáticas, responsable, etc.)

para asegurar que la información sea completa y útil tanto operativamente como para eventuales

auditorías o exigencias legales.

Además, Auravant destaca por su enfoque en mapas y gestión geoespacial de los lotes. Permite

dibujar polígonos de campos, calcular hectáreas automáticamente y visualizar datos históricos. Nuestra

aplicación, de igual modo, incorporará mapas interactivos (usaremos librerías tipo Leaflet/Turf.js ya

integradas en nuestro prototipo técnico) para que el piloto pueda ver las áreas a fumigar y registrar con

precisión qué superficie se cubrió en cada aplicación. Esto es crucial en aplicaciones aéreas donde se

cobran tarifas por hectárea tratada – el sistema podría calcular automáticamente las hectáreas

cubiertas a partir del polígono del lote y la ruta de vuelo registrada.

Por último, Auravant ofrece colaboración multiusuario (permite compartir datos entre miembros de

un equipo o con asesores externos). Aunque nuestro primer entregable será más simple en cuanto a

roles, mantenemos la visión de crecer hacia algo similar: una plataforma colaborativa donde piloto,

productores y otros partícipes puedan interactuar según permisos.

Spray Diary – Registro Digital de Aplicaciones (Spray Log)

Spray Diary es una aplicación especializada en el registro de aplicaciones de agroquímicos y se

presenta como un diario digital de fumigaciones. A diferencia de Auravant (más amplio en funciones

2

agronómicas), Spray Diary se enfoca casi exclusivamente en las necesidades de documentación y

planificación de tareas de pulverización. Esto lo hace muy pertinente para nuestro análisis, ya que

cubre el flujo completo desde la programación de un trabajo hasta la generación de informes:

•

Programación de tareas: Spray Diary permite agendar trabajos de fumigación con anticipación,

asignando fecha, locación y personal. En nuestro caso, implementaremos algo similar para que

el piloto pueda cargar "misiones" o pedidos con campos a tratar y fechas previstas, lo que sirve

también como lista de tareas pendientes.

•

Registro detallado: Durante o después de completar la tarea, la app recopila información

exhaustiva de la aplicación: qué producto se aplicó y a qué dosis, contra qué plaga o

enfermedad, quién fue el operador (piloto) y supervisor, medidas de seguridad tomadas,

condiciones meteorológicas (temperatura, viento, humedad) en el momento, equipo utilizado

(p.ej. avión, tipo de boquilla) y ubicación exacta

5

6

. Esta descripción casi coincide con los

campos que imaginamos para nuestro módulo de registro de fumigaciones. De hecho, nuestro

modelo de datos ya contempla atributos como tipo de tratamiento, producto, dosis, equipo

(incluyendo opción "AVIÓN"), clima, responsable, etc., alineándose con lo que este competidor

ofrece.

•

Funciones adicionales: Spray Diary incluye gestión de inventario (controlar stock de químicos, por

ejemplo) y ayuda con la calibración de equipos de pulverización

7

. También destaca por

ofrecer cálculos automáticos, como resúmenes de mezcla de tanque según las dosis

ingresadas

8

, y consulta de datos meteorológicos en la ubicación seleccionada

6

. Estas

características aportan valor agregado ahorrando tiempo al usuario. En nuestro caso, podríamos

no implementar todas esas funciones desde el día uno, pero las tenemos en el radar para

futuras iteraciones (por ejemplo, integración con APIs meteorológicas para completar

automáticamente el clima en el registro

9

).

•

Compartir y reportes: Un punto muy importante es que Spray Diary facilita compartir el diario de

aplicaciones con terceros y exportar reportes profesionales en formatos predeterminados

10

11

. Esto exactamente responde a la necesidad de nuestro piloto de presentar informes a sus

clientes (dueños del campo fumigado o empresas contratantes) y también conservar registros

formales para su propia contabilidad o inspecciones. Nuestra aplicación deberá entonces incluir

la capacidad de generar un "parte de aplicación" o reporte una vez completado el trabajo, con

todos los datos relevantes (campo, fecha, insumos usados, área cubierta, piloto, costo, etc.), que

se pueda enviar al cliente o descargar/PDF. Asimismo, consideraremos un mecanismo de

compartir acceso: quizás un portal del cliente o enlaces de invitado donde el productor pueda

consultar en línea el estado de sus pedidos y detalles de fumigaciones realizadas, similar a cómo

Spray Diary permite enviar instrucciones por SMS o compartir el diario digitalmente.

En síntesis, Spray Diary nos marca la importancia de un diario digital centralizado y accesible desde

cualquier dispositivo, eliminando planillas dispersas, calendarios y papeleo

12

. Nuestra solución

buscará replicar esa simplicidad: una aplicación web responsiva (y eventualmente móvil) a la que el

piloto pueda acceder desde la computadora del hangar o desde su tablet en el campo, con o sin

conexión (nuestro prototipo ya considera modo offline con almacenamiento local).

DeepAgro – Pulverización Selectiva con IA

DeepAgro es una startup argentina AgTech enfocada en inteligencia artificial aplicada a la

pulverización. Si bien DeepAgro no ofrece una plataforma de gestión de tareas como tal, su tecnología

SprAI merece mención como parte del panorama competitivo, ya que muestra hacia dónde evoluciona

3

el rubro. SprAI es un sistema de aplicación selectiva de herbicidas que mediante visión artificial

detecta malezas y activa boquillas sólo cuando corresponde, diferenciando en tiempo real las malezas

del cultivo

13

. Esto logra ahorros de hasta 90% en agroquímicos y reduce el impacto ambiental de las

fumigaciones

14

15

.

¿Por qué nos importa esta tecnología en un documento de alcance funcional? Por dos razones: primero,

indica que la precisión y eficiencia en las aplicaciones es un aspecto cada vez más valorado – nuestra

plataforma podría eventualmente integrarse con sistemas de este tipo (por ejemplo, importando

mapas de malezas detectadas o registrando qué zonas del lote fueron pulverizadas efectivamente). Y

segundo, porque refuerza la idea de que los datos de campo (georreferenciación de malezas, dosis

efectivamente aplicadas, etc.) son oro para optimizar operaciones. Un piloto usando nuestra app podría

en el futuro beneficiarse de integraciones con dispositivos inteligentes o algoritmos que mejoren su

toma de decisiones (por ejemplo, recomendando dosis o avisando si las condiciones de viento exceden

lo óptimo). Si bien esto queda fuera del MVP inicial, conocer a DeepAgro y su propuesta nos inspira a

dejar abiertas las puertas a la innovación: diseñar con APIs o módulos que más adelante incorporen

funciones de pulverización de precisión.

Flight Plan Online – Gestión Integral para Aplicadores Aéreos

Identificamos también un referente específico para aeroaplicadores: la solución Flight Plan Online® de

AgriSmart (orientada al mercado de EE.UU.). Esta plataforma demuestra buenas prácticas en la gestión

integral de un negocio de fumigación aérea. Cubre todo el proceso de aplicación aérea, de punta a

punta: planificación de pedidos, creación de misiones con mapas precisos, seguimiento de vuelos en

curso, registro de "lo aplicado" (as-applied data), gestión de inventario de químicos, hasta la facturación

rápida al cliente

16

. Todo en un sistema unificado en la nube, accesible desde cualquier lugar con

Internet

17

. Un aspecto sobresaliente es cómo involucra también al cliente: Flight Plan Online permite

que los productores/retailers clientes tengan su propia cuenta para seguir el progreso de sus órdenes

de trabajo en tiempo real (saben cuándo un lote fue fumigado sin tener que llamar al piloto) e incluso

reciben emails automáticos cuando cambia el estado de sus pedidos

18

. Este modelo de portal de

clientes con notificaciones es muy relevante para nuestro alcance. Vamos a incluir en nuestros

requerimientos la posibilidad de que el cliente final reciba confirmaciones (vía email o dentro de la app)

cuando su campo ha sido tratado, y que pueda consultar un mapa o reporte de la aplicación realizada.

A nivel arquitectónico, esto reafirma la necesidad de soporte multi-tenant y roles separados: el piloto/

empresa de fumigación administra todo y ve todos los datos, mientras que cada cliente solo ve sus

propios campos y trabajos

19

– exactamente lo que planeamos implementar en materia de permisos.

Otro punto valioso de Flight Plan Online es la integración con sistemas de guía GPS abordo de las

aeronaves. Permite descargar shapefiles de lotes o franjas de trabajo directamente al sistema GPS del

avión, ahorrando al piloto introducir coordenadas manualmente, y luego subir los archivos de resultado

("lo realmente rociado") para generar reportes precisos de cobertura

20

. Tomaremos nota de esta

funcionalidad: nuestra aplicación en fases avanzadas podría ofrecer exportación/importación de

archivos de coordenadas (en formatos como shapefile o GeoJSON) para facilitar la carga de rutas de

vuelo en equipos Ag-Nav, Satloc u otros. Por ahora, en la versión 1, al menos facilitaremos al piloto

visualizar el polígono del lote y quizás marcar manualmente qué partes cubrió, pero mantenemos en

backlog la idea de integraciones con hardware de vuelo.

En resumen, el benchmark muestra que ninguna solución existente en nuestro mercado local cubre

exactamente todas las necesidades de los pilotos fumigadores de forma sencilla y específica. Auravant

provee un ecosistema agrícola amplio (incluyendo registro de aplicaciones) pero no está especializado

en las operaciones de un contratista aéreo. Spray Diary lleva muy bien el diario de pulverización y

cumplimiento, pero no incorpora tanto la parte logística (mapas avanzados, integración con GPS de

4

avión, etc.). Flight Plan Online sí está hecho a la medida de empresas de aplicación aérea, pero es un

producto foráneo y posiblemente costoso para nuestro mercado (licenciamiento por acre fumigada

21

). Esto nos da una oportunidad de construir una herramienta especializada, local y asequible,

combinando lo mejor de esos mundos: robustez en registro de datos (tipo Spray Diary/Auravant) +

enfoque operativo y de negocio para aplicadores (tipo Flight Plan Online), adaptado al contexto

latinoamericano.

Funcionalidades Clave de la Solución Propuesta

A partir del análisis anterior y las necesidades específicas levantadas, definimos los módulos o

componentes principales que debe tener la versión inicial del producto. Cabe destacar que la

arquitectura será modular y escalable, permitiendo agregar componentes (microservicios o módulos

front-end) a medida que crezca la suite de aplicaciones. En un futuro podríamos ofrecer diferentes tiers

de servicio (por ejemplo: un plan básico solo de registro de aplicaciones, y planes premium con mapas

avanzados, gestión de equipos, analíticas, etc.), por lo que conviene sentar las bases desde el inicio para

una plataforma extensible.

Para la Primera Versión (MVP), nos enfocaremos en los siguientes aspectos fundamentales:

•

Registro de Aplicaciones (Spray Diary) – El corazón de la aplicación será un diario digital donde

el piloto pueda registrar cada fumigación realizada. Cada entrada de fumigación incluirá:

fecha y hora, campo/lote tratado (seleccionable de un listado de lotes precargados con sus

polígonos), cultivo y plaga objetivo, producto fitosanitario utilizado y dosis (ej. 3 L/ha de

herbicida X), volumen total aplicado, condición del vuelo (completado o si hubo incidentes),

condiciones climáticas (temperatura, humedad, viento, opcionalmente obtenido de API

meteorológica), nombre del piloto y ayudante, y cualquier observación adicional. Esta

funcionalidad asegura que nunca más se pierda información en cuadernos o planillas – todo

queda centralizado y respaldado

22

. Además, estos registros servirán para generar reportes

(internos y para clientes) y para consulta histórica (ej.: ¿qué producto se aplicó en tal lote la

última vez y cómo resultó?).

•

Gestión de Clientes y Campos (Multitenencia) – El piloto/contratista podrá dar de alta los

clientes (productores o empresas) con los que trabaja, así como los campos o lotes de esos

clientes. Cada lote tendrá sus datos: ubicación geográfica (polígono en mapa), cultivo, superficie,

etc. La aplicación relacionará las fumigaciones registradas con el lote y con el cliente dueño de

ese lote. De esta manera, luego podremos filtrar o agrupar información fácilmente (por ejemplo,

mostrar al cliente X todas las aplicaciones hechas en su establecimiento durante la campaña).

Implementaremos un sistema de usuarios donde el piloto actúa como administrador de su

empresa de servicios, y puede invitar a clientes a acceder a su información (cada cliente con

credenciales propias, viendo solo lo suyo, en línea con el modelo de Flight Plan Online

19

).

Inicialmente, puede que optemos por algo sencillo como generar un enlace de invitado al

reporte, pero la meta es que cada cliente tenga su cuenta (opcional) para entrar al portal. La

aplicación desde el día uno tendrá la estructura de datos lista para soportar multi-tenant (por

ejemplo, un identificador de organización o contratista al que pertenece cada registro) aunque

en el MVP quizás solo usemos una organización mientras probamos.

•

Mapa de Lotes y Planificación de Vuelos – Incorporaremos un módulo de mapas interactivos

donde visualizar los lotes. Desde ahí, el usuario piloto podría dibujar o cargar la ubicación exacta

de un área a fumigar. Esto cumple doble propósito: obtener la superficie (ha) calculada

automáticamente para saber cuánto producto preparar y cuánto cobrar, y proporcionar un

5

visual para planificar el vuelo (ver entradas/salidas del lote, obstáculos, etc.). Más adelante, este

módulo se extenderá para permitir crear misiones de vuelo: por ejemplo, seleccionar varios

lotes en una zona para fumigarlos en un solo vuelo, optimizando la ruta. En el MVP, al menos

cada registro de fumigación podrá vincularse a un mapa – quizás integrando un MapaEditor en el

formulario para que el piloto pueda ajustar si no cubrió todo el polígono, etc. También

exploraremos la posibilidad de adjuntar archivos de rutas (as-applied). Este enfoque geoespacial

nos diferenciará de llevar solo un diario textual, dando un componente visual potente a la

aplicación (similar a Auravant en facilidad de mapeo).

•

Módulo Operativo (Logística de Vuelos) – Si bien el registro es fundamental, queremos

también apoyar la operación diaria del piloto. Esto implica funciones como: crear órdenes de

trabajo o solicitudes de fumigación entrantes (p. ej., el productor pide tratar el Lote A contra tal

plaga la semana próxima), un tablero de tareas pendientes con estatus (Planificado, En

proceso, Completado, Cancelado – estados ya contemplados en nuestro modelo

23

24

), y

posibilidad de marcar cuándo una tarea está en progreso o terminada. En la práctica, esto

servirá como un checklist digital para el piloto: qué vuelos tiene programados hoy, qué carga de

químico necesita preparar, etc. Una vez terminado un trabajo, se marca como completado y

automáticamente queda registrado en el diario con fecha/hora real. Este módulo también podrá

incluir alertas o notificaciones – por ejemplo, avisar al cliente que su lote fue atendido (vía

email, notificación push en futuros desarrollos

25

26

).

•

Facturación y Cálculo de Costos – Dado que uno de los objetivos primordiales es que el piloto

pueda cobrar sus servicios fácilmente, la aplicación debe ayudar a calcular y documentar los

importes. En cada registro de aplicación se podrá computar el costo: esto puede ser una tarifa

fija por hectárea fumigada multiplicada por las hectáreas efectivas (para lo cual el polígono es

útil) más, si corresponde, el costo de los insumos provistos. Permitiremos configurar por cliente

o por trabajo la modalidad de cobro (por ha, por hora de vuelo, forfait mínimo, etc.). Con esos

datos, el sistema podrá generar una factura proforma o una orden de cobro. En un principio

quizás solo sea un documento PDF sencillo con los datos de la aplicación y el monto, pero

eventualmente podría integrarse con sistemas contables o de pagos. Flight Plan Online enfatiza

la "facturación rápida" después de completar la aplicación

16

, y es algo que queremos replicar:

reducir al mínimo el tiempo entre terminar el trabajo y emitir la documentación para cobrar,

eliminando errores de cálculo.

•

Reportes y Análisis – Aunque sea básico al inicio, incluiremos un par de reportes clave: por

ejemplo, un reporte resumido tipo spray report por cliente (todas las aplicaciones hechas en

cierto rango de fechas, total de hectáreas, químicos usados) que puede servir para que el

productor tenga su registro anual o para presentar a autoridades si lo requiere; y un pequeño

dashboard para el piloto con métricas como número de vuelos completados en el mes,

hectáreas tratadas, efectividad (si se puede medir de algún modo), etc. Nuestro prototipo

técnico ya tiene un dashboard con algunos KPIs (fumigaciones, hectáreas, tareas pendientes)

27

, lo adaptaremos a datos reales. Más adelante estos análisis pueden volverse más

sofisticados (ej. tendencias temporales, rendimiento por cultivo, etc.), pero en MVP con que

cubra lo básico estará alineado a la propuesta de valor principal.

En cuanto a aspectos tecnológicos y de arquitectura, vale aclarar que el sistema se construirá como

una SPA (Single Page Application) React (como ya se viene desarrollando), posiblemente

complementada con servicios en la nube cuando implementemos back-end para autenticación

multiusuario, almacenamiento centralizado y sincronización. Inicialmente podríamos lanzar con un

enfoque offline-first (toda la data local en el dispositivo del piloto, sincronizando manualmente informes

con sus clientes), pero dado el objetivo colaborativo será importante migrar pronto a una arquitectura

6

cliente-servidor con base de datos central. Desde ya, se contemplará integrar APIs externas útiles:

pronóstico del tiempo, precios de combustibles o agroquímicos, mapas satelitales, e incluso las APIs

gubernamentales para generar automáticamente informes oficiales de aplicaciones si existen (tal como

insinuamos en nuestro desarrollo futuro

9

).

Conclusiones y Siguientes Pasos

En síntesis, proponemos desarrollar una plataforma integral pero modular que en su primera versión

resuelva las necesidades críticas de un piloto aeroaplicador para gestionar sus trabajos y registros,

tomando inspiración de soluciones existentes pero adaptada a nuestro contexto regional. Los pilares

del MVP serán: un cuaderno digital de fumigación completo (estilo Spray Diary), componentes de

mapa y planificación (tomando lecciones de Auravant y prácticas de Flight Plan Online), y

funcionalidades de negocio (gestión de clientes, notificaciones y facturación rápida) específicas para la

operación de servicios de aplicación aérea.

Con las aclaraciones de alcance geográfico (Argentina/LatAm primero, pero visión global) y usuario

prioritario (piloto individual, involucrando a sus clientes), queda asentado el contexto para la

investigación de mercado ya realizada. A partir de aquí, el siguiente paso será proceder con el borrador

del documento de alcance formal, incorporando los hallazgos de este benchmark y detallando

requerimientos funcionales específicos, pantallas principales, y una hoja de ruta de desarrollo por

fases. En ese documento se incluirán también tablas comparativas de funcionalidades vs. competencia

y se delinearán los deliverables del MVP.

Con esta base investigativa y estratégica, estaremos listos para armar la propuesta de valor de nuestra

aplicación de manera sólida y comenzar el diseño detallado con miras a una implementación exitosa.

Fuentes y Referencias:

•

Auravant – Plataforma de agricultura digital (cuaderno de campo, monitoreo de lotes)

•

Spray Diary – Spray record management app (registro de aplicaciones, clima, reportes)

2

5

1

6

•

DeepAgro – Tecnología de pulverización selectiva con IA (detección de malezas, ahorro de

químicos)

13

14

•

AgriSmart Flight Plan Online – Sistema para aplicadores aéreos (gestión integral: planificación →

spray → facturación, portal clientes)
Análisis Técnico Interno (FumigApp) – Estructura de datos y plan de desarrollo (soporte

28

16

•

multirole planificado, estados de fumigación, etc.)

25

23

1

2

▷ Cuaderno de Campo digital y oficial - Auravant

https://www.auravant.com/blog/extensiones-es/con-auravant-tienes-el-cuaderno-de-campo-digital-obligatorio-y-oficial/

3

4

9

23

24

25

26

27

TECHNICAL_ANALYSIS_REPORT.md

file://file_00000000553c71f5aae7adfdf038de77

5

6

7

8

10

11

12

22

Simplify Spray Record Management | Spray Diary App

https://www.spraydiary.com/

13

14

15

DeepAgro™ | Pulverización Selectiva | AgTech

https://www.deepagro.com/es/

16

17

18

19

20

21

28

Flight Plan Online

https://www.agrismartis.com/flight-plan-online

7
