<?php
$conn = new mysqli("localhost", "root", "", "misitiof");
if ($conn->connect_error) {
    die("<div class='w3-panel w3-red'>Error de conexión: " . $conn->connect_error . "</div>");
}+9
$clientes = $conn->query("SELECT id, nombre_cliente FROM clientes ORDER BY nombre_cliente ASC");
$productos_result = $conn->query("SELECT codigo, nombre, precio_venta FROM productos ORDER BY nombre ASC");
$productos = array();
while($row = $productos_result->fetch_assoc()) {
    $productos[] = $row;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Facturar - Ediciones Fares</title>
    <link rel="stylesheet" href="w3.css">
    <style>
        body {
            background: linear-gradient(120deg, #f8fafc 0%, #e0e7ef 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .factura-container {
            max-width: 900px;
            margin: 40px auto;
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 8px 32px rgba(60,60,120,0.12);
            padding: 2.5rem 2rem 2rem 2rem;
        }
        .factura-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        .factura-header h3 {
            margin: 0;
            color: #3498db;
            font-size: 2rem;
            letter-spacing: 1px;
        }
        .factura-no {
            background: #b2ebf2;
            color: #222;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 1.1rem;
        }
        .factura-table th, .factura-table td {
            text-align: center;
            padding: 0.7rem 0.5rem;
        }
        .factura-table th {
            background: #3498db;
            color: #fff;
            font-weight: 600;
        }
        .factura-table tr:nth-child(even) {
            background: #f4f8fb;
        }
        .factura-totales {
            margin-top: 20px;
        }
        .factura-totales input {
            text-align: right;
            background: #f4f8fb;
            border: 1px solid #bfc9d1;
            border-radius: 8px;
            padding: 0.6rem 1rem;
            font-size: 1rem;
        }
        .w3-button {
            margin-right: 8px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 1rem;
            padding: 0.6rem 1.2rem;
            background: linear-gradient(90deg, #3498db 0%, #6dd5fa 100%);
            color: #fff;
            border: none;
            box-shadow: 0 2px 8px rgba(52,152,219,0.08);
            transition: background 0.2s;
        }
        .w3-button:hover {
            background: linear-gradient(90deg, #2980b9 0%, #48c6ef 100%);
        }
        .w3-select {
            width: 100%;
            padding: 0.7rem 1rem;
            border: 1px solid #bfc9d1;
            border-radius: 8px;
            font-size: 1rem;
            background: #f4f8fb;
            margin-bottom: 0.7rem;
        }
        .w3-input[type="number"] {
            width: 100%;
            padding: 0.7rem 1rem;
            border: 1px solid #bfc9d1;
            border-radius: 8px;
            font-size: 1rem;
            background: #f4f8fb;
        }
        .w3-input[type="number"]:focus, .w3-select:focus {
            border: 1.5px solid #3498db;
            outline: none;
            background: #eaf6fb;
        }
        .w3-padding {
            padding: 1.2rem 0 !important;
        }
        footer {
            text-align: center;
            margin-top: 2rem;
            color: #888;
            font-size: 0.95rem;
        }
    </style>
    <style>
        @media print {
            body * { visibility: hidden !important; }
            .factura-container, .factura-container * { visibility: visible !important; }
            .factura-container { position: absolute; left: 0; top: 0; width: 100% !important; box-shadow: none !important; }
            #btnImprimir, .w3-button, nav, footer { display: none !important; }
        }
    </style>
</head>
<body>
<div class="w3-container">
    <h2 class="w3-black w3-padding" style="text-align:center; color:#3498db;">Ediciones Fares</h2>
    <div class="w3-container">
        <nav class="w3-bar fcolor-l4">
            <a href="#" class="w3-bar-item w3-button w3-mobile">Principal</a>
            <div class="w3-dropdown-hover w3-mobile">
                <button class="w3-button w3-mobile">Educación</button>
                <div class="w3-dropdown-content w3-bar-block ftema">
                    <a href="#" class="w3-bar-item w3-button w3-mobile">Educación Básica</a>
                    <a href="#" class="w3-bar-item w3-button w3-mobile">I BTP y I BCH</a>
                    <a href="#" class="w3-bar-item w3-button w3-mobile">III BTP</a>
                </div>
            </div>
            <div class="w3-dropdown-hover w3-mobile">
                <button class="w3-button w3-mobile">Inventario</button>
                <div class="w3-dropdown-content w3-bar-block ftema">
                    <a href="cproductos.php" class="w3-bar-item w3-button w3-mobile">Crear producto</a>
                    <a href="#" class="w3-bar-item w3-button w3-mobile">Consultar y modificar producto</a>
                    <a href="#" class="w3-bar-item w3-button w3-mobile">Clientes</a>
                    <a href="#" class="w3-bar-item w3-button w3-mobile">Agregar inventario</a>
                    <a href="FACTURA.php" class="w3-bar-item w3-button w3-mobile">Facturar</a>
                    <a href="libroscomentarios/index.php" class="w3-bar-item w3-button w3-mobile">Información libros</a>
                </div>
            </div>
            <a href="#" class="w3-bar-item w3-button w3-mobile">Contacto</a>
        </nav>
    </div>
    <div class="factura-container w3-card-4 w3-white w3-padding">
        <div class="factura-header">
            <h3 class="w3-black w3-padding" style="border-radius:8px;">PULHAZAK</h3>
            <span class="factura-no">Factura No. <span id="facturaNo">1</span> <span id="facturaId">1023</span></span>
        </div>
        <form id="formFactura" autocomplete="off" onsubmit="return false;">
            <div class="w3-row-padding w3-margin-top">
                <div class="w3-third">
                    <label><b>Seleccionar cliente:</b></label>
                    <select class="w3-select" id="cliente" name="cliente" required>
                        <option value="">Seleccione...</option>
                        <?php while($c = $clientes->fetch_assoc()): ?>
                            <option value="<?php echo $c['id']; ?>"><?php echo $c['nombre_cliente']; ?></option>
                        <?php endwhile; ?>
                    </select>
                </div>
                <div class="w3-third">
                    <label><b>Seleccionar producto:</b></label>
                    <select class="w3-select" id="producto">
                        <option value="">Seleccione...</option>
                        <?php foreach($productos as $p): ?>
                            <option value='<?php echo json_encode(["codigo"=>$p["codigo"],"nombre"=>$p["nombre"],"precio"=>$p["precio_venta"]]); ?>'><?php echo $p["codigo"] . " - " . $p["nombre"]; ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="w3-third">
                    <label><b>Cantidad:</b></label>
                    <input class="w3-input" type="number" id="cantidad" min="1" value="1">
                </div>
            </div>
            <div class="w3-row-padding w3-margin-top">
                <button type="button" class="w3-button w3-blue" onclick="agregarProducto()">Agregar producto</button>
                <button type="button" class="w3-button w3-green" onclick="guardarFactura()">Guardar factura</button>
                <button type="button" class="w3-button w3-grey" onclick="nuevaFactura()">Nueva factura</button>
            </div>
            <div class="w3-responsive w3-margin-top">
                <table class="w3-table w3-bordered w3-striped factura-table" id="tablaProductos">
                    <thead>
                        <tr class="w3-brown">
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Total</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Productos agregados -->
                    </tbody>
                </table>
                <div id="registrosGuardados" class="w3-padding w3-text-green"></div>
            </div>
            <div class="factura-totales w3-row-padding w3-margin-top">
                <div class="w3-third">
                    <label>Subtotal:</label>
                    <input class="w3-input" type="text" id="subtotal" readonly>
                </div>
                <div class="w3-third">
                    <label>ISV(13%):</label>
                    <input class="w3-input" type="text" id="iva" readonly>
                </div>
                <div class="w3-third">
                    <label>Total a pagar:</label>
                    <input class="w3-input" type="text" id="total" readonly>
                </div>
            </div>
        </form>
        <button type="button" class="w3-button w3-orange w3-margin-top" onclick="imprimirFactura()" id="btnImprimir">Imprimir</button>
    </div>
</div>
<footer>
    <p>Todos los Derechos Reservados Debora Guifarro &copy; 2004-2026</p>
</footer>
<script>
let productosFactura = [];
function agregarProducto() {
    const select = document.getElementById('producto');
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!select.value) return alert('Seleccione un producto');
    let prod;
    try {
        prod = JSON.parse(select.value);
    } catch (e) {
        alert('Error al leer el producto. Valor inválido.');
        return;
    }
    const existente = productosFactura.find(p => p.codigo === prod.codigo);
    if (existente) {
        existente.cantidad += cantidad;
    } else {
        productosFactura.push({ ...prod, cantidad, precio: Number(prod.precio) });
    }
    renderTabla();
}
function renderTabla() {
    const tbody = document.querySelector('#tablaProductos tbody');
    tbody.innerHTML = '';
    let subtotal = 0;
    productosFactura.forEach((p, idx) => {
        const total = p.precio * p.cantidad;
        subtotal += total;
        tbody.innerHTML += `<tr>
            <td>${p.codigo}</td>
            <td>${p.nombre}</td>
            <td>${p.cantidad}</td>
            <td>${p.precio.toFixed(2)}</td>
            <td>${total.toFixed(2)}</td>
            <td><button type='button' class='w3-button w3-red' onclick='eliminarProducto(${idx})'>Eliminar</button></td>
        </tr>`;
    });
    document.getElementById('subtotal').value = subtotal.toFixed(2);
    const iva = subtotal * 0.13;
    document.getElementById('iva').value = iva.toFixed(2);
    document.getElementById('total').value = (subtotal + iva).toFixed(2);
}
function eliminarProducto(idx) {
    productosFactura.splice(idx, 1);
    renderTabla();
}
function nuevaFactura() {
    productosFactura = [];
    renderTabla();
    document.getElementById('cliente').selectedIndex = 0;
    document.getElementById('producto').selectedIndex = 0;
    document.getElementById('cantidad').value = 1;
    document.getElementById('registrosGuardados').innerHTML = '';
    document.getElementById('subtotal').value = '';
    document.getElementById('iva').value = '';
    document.getElementById('total').value = '';
}
function guardarFactura() {
    if (!document.getElementById('cliente').value) return alert('Seleccione un cliente');
    if (productosFactura.length === 0) return alert('Agregue al menos un producto');
    document.getElementById('registrosGuardados').innerHTML = '¡Factura guardada correctamente!';
}

function imprimirFactura() {
    window.print();
}
</script>
</body>
</html>
<?php $conn->close(); ?>
