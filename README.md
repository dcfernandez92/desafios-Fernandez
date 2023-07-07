# Desafíos

- Primer desafío (Clase 02): ProductManager.js
- Segundo desafío (Clase 04): ProductManager.js con persistencia utilizando fs
- Tercer desafío (Clase 06): Se utiliza express y se utiliza en archivo app.js
- Cuarto desafío (Clase 10): Se utiliza Handlebars y WebSockets.

# Primer Pre-Entrega

Se incluye en esta pre entrega lo solicitado en la rúbricas, escuchando en el puerto 8080 y utilizando las rutas de /products y /carts, implementando el router de Express
Se agregan los endpoints solicitados para cada router con sus correspondientes validaciones.
Se implementa la funcionalidad de multer para el flujo de datos, enviando las imagenes como formData.

# Como levantar el servicio

Se deben ejecutar los siguientes comandos:

npm install nodemon
npm install mongoose-paginate-v2
npm start

# Segunda Pre-Entrega

Accediendo a la url http://localhost:8080/products se cumple con los siguientes puntos:
    - limit: devuelve la cantidad solicitada. en caso de no recibir limit, este será de 10. Ejemplo: 
        - http://localhost:8080/products?limit=2
    - page: permitirá devolver la página que queremos buscar, en caso de no recibir page, ésta será de 1. Tener en cuenta la cantidad de registros de la coleccion products cargados en la base de datos, ya que en caso de tener menos de 10 registros, no habrá paginación 
        - Ejemplo: http://localhost:8080/products?limit=2&page=2
    - query: busca productos por categoría o por disponibilidad, en caso de no ingresar una query, se realiza una búsqueda general. 
        - Ejemplo categoría: http://localhost:8080/products?category=Cuento
        - Ejemplo disponibilidad: http://localhost:8080/products?availability=out-of-stock / http://localhost:8080/products?availability=available
    - sort: ordenamiento ascendente o descendente por el campo precio.
        -Ejemplo: http://localhost:8080/products?sort=desc

Se cumple con el formato solicitado en el GET, utilizando paginación.

En el router carts se crean los endpoints indicados:
    - DELETE api/carts/:cid/products/:pid
    - PUT api/carts/:cid
    - PUT api/carts/:cid/products/:pid
    - DELETE api/carts/:cid
    - GET /:cid (Se modifica ruta utilizando populate para visualizar todos los datos del modelo products)

Se crea la vista en el router de views /products, donde se muestran todos los productos con su botón "Agrega al carrito". Si se presion el botón, agrega ese producto al cartId 64a783c447c8ba317bc07407 ya que se encuentra harcodeado para esta instancia del curso. Si se desea modificar el cartId por otro que se posea en la base de datos se debe modificar el código en el archivo products.handlebars (línea 6). Además se agrega la vista /carts/:cid para ver un carrito específico solo con los productos correspondientes a dicho carrito.