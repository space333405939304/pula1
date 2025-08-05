// menu.js

document.addEventListener('DOMContentLoaded', function() {
    // Carrito de compras
    let carrito = [];

    // Botón de carrito y modal
    const carritoBtn = document.getElementById('carrito-btn');
    const carritoContador = document.getElementById('carrito-contador');
    const carritoModal = document.getElementById('carrito-modal');
    const cerrarCarrito = document.getElementById('cerrar-carrito');
    const carritoItems = document.getElementById('carrito-items');
    const carritoTotal = document.getElementById('carrito-total');
    const generarFacturaBtn = document.getElementById('generar-factura');
    const facturaDiv = document.getElementById('factura');

    // Agregar al carrito
    document.querySelectorAll('.agregar-carrito').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.menu-item');
            const nombre = item.dataset.nombre;
            const precio = parseFloat(item.dataset.precio);
            const img = item.dataset.img;
            const existente = carrito.find(p => p.nombre === nombre);
            if (existente) {
                existente.cantidad++;
            } else {
                carrito.push({ nombre, precio, cantidad: 1, img });
            }
            actualizarCarrito();
        });
    });

    // Mostrar/ocultar modal
    carritoBtn.addEventListener('click', function() {
        carritoModal.classList.add('active');
        mostrarCarrito();
    });
    cerrarCarrito.addEventListener('click', function() {
        carritoModal.classList.remove('active');
        facturaDiv.style.display = 'none';
    });

    // Actualizar contador
    function actualizarCarrito() {
        const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
        carritoContador.textContent = total;
    }

    // Mostrar productos en el modal
    function mostrarCarrito() {
        carritoItems.innerHTML = '';
        if (carrito.length === 0) {
            carritoItems.innerHTML = '<p>El carrito está vacío.</p>';
            carritoTotal.textContent = '';
            facturaDiv.style.display = 'none';
            return;
        }
        carrito.forEach((p, idx) => {
            const div = document.createElement('div');
            div.className = 'carrito-item';
            div.innerHTML = `
                <span class="carrito-item-nombre">${p.nombre}</span>
                <span class="carrito-item-cantidad">
                    <button class="carrito-item-btn" data-accion="restar" data-idx="${idx}">-</button>
                    ${p.cantidad}
                    <button class="carrito-item-btn" data-accion="sumar" data-idx="${idx}">+</button>
                </span>
                <span>L.${(p.precio * p.cantidad).toFixed(2)}</span>
                <button class="carrito-item-btn" data-accion="eliminar" data-idx="${idx}">Eliminar</button>
            `;
            carritoItems.appendChild(div);
        });
        const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
        carritoTotal.textContent = `Total: L.${total.toFixed(2)}`;
        facturaDiv.style.display = 'none';
    }

    // Delegación de eventos para sumar/restar/eliminar
    carritoItems.addEventListener('click', function(e) {
        if (e.target.classList.contains('carrito-item-btn')) {
            const idx = parseInt(e.target.dataset.idx);
            const accion = e.target.dataset.accion;
            if (accion === 'sumar') {
                carrito[idx].cantidad++;
            } else if (accion === 'restar') {
                carrito[idx].cantidad--;
                if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);
            } else if (accion === 'eliminar') {
                carrito.splice(idx, 1);
            }
            actualizarCarrito();
            mostrarCarrito();
        }
    });

    // Agregar campos de cliente en el modal si no existen
    if (!document.getElementById('cliente-nombre')) {
        const clienteDiv = document.createElement('div');
        clienteDiv.style = 'margin-bottom: 16px;';
        clienteDiv.innerHTML = `
            <label for="cliente-nombre" style="font-weight:bold;">Nombre del cliente:</label>
            <input id="cliente-nombre" type="text" class="w3-input" style="width:100%;margin-top:4px;margin-bottom:8px;border-radius:8px;border:1px solid #bfc9d1;padding:0.7rem 1rem;" placeholder="Ingrese el nombre del cliente" required>
            <label for="cliente-telefono" style="font-weight:bold;">Teléfono:</label>
            <input id="cliente-telefono" type="text" class="w3-input" style="width:100%;margin-top:4px;margin-bottom:8px;border-radius:8px;border:1px solid #bfc9d1;padding:0.7rem 1rem;" placeholder="Ingrese el teléfono" required>
            <label for="cliente-direccion" style="font-weight:bold;">Dirección:</label>
            <input id="cliente-direccion" type="text" class="w3-input" style="width:100%;margin-top:4px;margin-bottom:8px;border-radius:8px;border:1px solid #bfc9d1;padding:0.7rem 1rem;" placeholder="Ingrese la dirección" required>
            <label for="cliente-metodo" style="font-weight:bold;">Método de pago:</label>
            <select id="cliente-metodo" class="w3-input" style="width:100%;margin-top:4px;margin-bottom:8px;border-radius:8px;border:1px solid #bfc9d1;padding:0.7rem 1rem;" required>
                <option value="">Seleccione método de pago...</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Otro">Otro</option>
            </select>
            <div id="metodo-extra"></div>
        `;
        facturaDiv.parentNode.insertBefore(clienteDiv, facturaDiv);

        // Lógica para mostrar campos extra según método de pago
        const metodoSelect = clienteDiv.querySelector('#cliente-metodo');
        const metodoExtraDiv = clienteDiv.querySelector('#metodo-extra');
        metodoSelect.addEventListener('change', function() {
            metodoExtraDiv.innerHTML = '';
            if (this.value === 'Tarjeta') {
                metodoExtraDiv.innerHTML = `
                    <label for='tarjeta-numero' style='font-weight:bold;'>Número de tarjeta:</label>
                    <input id='tarjeta-numero' type='text' class='w3-input' style='width:100%;margin-top:4px;margin-bottom:8px;border-radius:8px;border:1px solid #bfc9d1;padding:0.7rem 1rem;' placeholder='Ingrese el número de tarjeta' required>
                    <label for='tarjeta-titular' style='font-weight:bold;'>Nombre del titular:</label>
                    <input id='tarjeta-titular' type='text' class='w3-input' style='width:100%;margin-top:4px;margin-bottom:8px;border-radius:8px;border:1px solid #bfc9d1;padding:0.7rem 1rem;' placeholder='Ingrese el nombre del titular' required>
                `;
            } else if (this.value === 'Transferencia') {
                metodoExtraDiv.innerHTML = `
                    <label for='transf-referencia' style='font-weight:bold;'>Número de referencia:</label>
                    <input id='transf-referencia' type='text' class='w3-input' style='width:100%;margin-top:4px;margin-bottom:8px;border-radius:8px;border:1px solid #bfc9d1;padding:0.7rem 1rem;' placeholder='Ingrese el número de referencia' required>
                    <label for='transf-banco' style='font-weight:bold;'>Banco:</label>
                    <input id='transf-banco' type='text' class='w3-input' style='width:100%;margin-top:4px;margin-bottom:8px;border-radius:8px;border:1px solid #bfc9d1;padding:0.7rem 1rem;' placeholder='Ingrese el banco' required>
                `;
            }
        });
    }

    // Generar factura
    generarFacturaBtn.addEventListener('click', function() {
        if (carrito.length === 0) return;
        const clienteNombre = document.getElementById('cliente-nombre').value.trim();
        const clienteTelefono = document.getElementById('cliente-telefono').value.trim();
        const clienteDireccion = document.getElementById('cliente-direccion').value.trim();
        const clienteMetodo = document.getElementById('cliente-metodo').value.trim();
        let metodoExtraHtml = '';
        if (!clienteNombre || !clienteTelefono || !clienteDireccion || !clienteMetodo) {
            alert('Por favor, complete todos los datos del cliente.');
            return;
        }
        if (clienteMetodo === 'Tarjeta') {
            const tarjetaNumero = document.getElementById('tarjeta-numero')?.value.trim();
            const tarjetaTitular = document.getElementById('tarjeta-titular')?.value.trim();
            if (!tarjetaNumero || !tarjetaTitular) {
                alert('Por favor, complete los datos de la tarjeta.');
                return;
            }
            metodoExtraHtml = `<div style='margin-bottom:8px;'><b>Número de tarjeta:</b> ${tarjetaNumero}</div><div style='margin-bottom:8px;'><b>Nombre del titular:</b> ${tarjetaTitular}</div>`;
        } else if (clienteMetodo === 'Transferencia') {
            const transfReferencia = document.getElementById('transf-referencia')?.value.trim();
            const transfBanco = document.getElementById('transf-banco')?.value.trim();
            if (!transfReferencia || !transfBanco) {
                alert('Por favor, complete los datos de la transferencia.');
                return;
            }
            metodoExtraHtml = `<div style='margin-bottom:8px;'><b>Referencia:</b> ${transfReferencia}</div><div style='margin-bottom:8px;'><b>Banco:</b> ${transfBanco}</div>`;
        }
        const fecha = new Date();
        const fechaStr = fecha.toLocaleDateString() + ' ' + fecha.toLocaleTimeString();
        const numFactura = Math.floor(Math.random() * 900000 + 100000);
        let subtotal = 0;
        let html = `<div class='factura-container' style='max-width:700px;margin:0 auto;background:#fff;border-radius:18px;box-shadow:0 8px 32px rgba(60,60,120,0.12);padding:2.5rem 2rem 2rem 2rem;'>
            <div class='factura-header' style='display:flex;align-items:center;gap:10px;margin-bottom:1.5rem;'>
                <img src='img/logo.png' alt='Logo' style='height:90px;width:auto;max-width:120px;border-radius:12px;margin-right:6px;display:block;'>
                <h3 style='margin:0;color:#3498db;font-size:2.4rem;letter-spacing:1.5px;'>PULHAPANZAK</h3>
                <span class='factura-no' style='background:#b2ebf2;color:#222;padding:10px 22px;border-radius:8px;font-weight:bold;font-size:1.2rem;margin-left:auto;'>Factura No. <span>${numFactura}</span></span>
            </div>
            <div style='margin-bottom:8px;'><b>Cliente:</b> ${clienteNombre}</div>
            <div style='margin-bottom:8px;'><b>Teléfono:</b> ${clienteTelefono}</div>
            <div style='margin-bottom:8px;'><b>Dirección:</b> ${clienteDireccion}</div>
            <div style='margin-bottom:8px;'><b>Método de pago:</b> ${clienteMetodo}</div>
            ${metodoExtraHtml}
            <div style='margin-bottom:18px;'><span style='float:right;color:#888;'>${fechaStr}</span></div>
            <div class='w3-responsive w3-margin-top'>
                <table class='w3-table w3-bordered w3-striped factura-table' style='width:100%;border-collapse:collapse;'>
                    <thead>
                        <tr style='background:#3498db;color:#fff;'>
                            <th style='padding:0.7rem 0.5rem;'>Descripción</th>
                            <th style='padding:0.7rem 0.5rem;'>Cantidad</th>
                            <th style='padding:0.7rem 0.5rem;'>Precio</th>
                            <th style='padding:0.7rem 0.5rem;'>Total</th>
                        </tr>
                    </thead>
                    <tbody>`;
        carrito.forEach(p => {
            const totalLinea = p.precio * p.cantidad;
            subtotal += totalLinea;
            html += `<tr style='background:#f4f8fb;'>
                <td style='text-align:center;padding:0.7rem 0.5rem;'>${p.nombre}</td>
                <td style='text-align:center;padding:0.7rem 0.5rem;'>${p.cantidad}</td>
                <td style='text-align:center;padding:0.7rem 0.5rem;'>L.${p.precio.toFixed(2)}</td>
                <td style='text-align:center;padding:0.7rem 0.5rem;'>L.${totalLinea.toFixed(2)}</td>
            </tr>`;
        });
        html += `</tbody></table>
                <div class='factura-totales w3-row-padding w3-margin-top' style='margin-top:20px;display:flex;justify-content:flex-end;'>
                    <table style='min-width:320px;'>
                        <tr><td style='text-align:right;padding:6px 12px;'>Subtotal:</td><td style='text-align:right;padding:6px 12px;'>L.${subtotal.toFixed(2)}</td></tr>
                        <tr><td style='text-align:right;padding:6px 12px;'>ISV (13%):</td><td style='text-align:right;padding:6px 12px;'>L.${(subtotal*0.13).toFixed(2)}</td></tr>
                        <tr><td style='text-align:right;padding:6px 12px;font-weight:bold;'>Total a pagar:</td><td style='text-align:right;padding:6px 12px;font-weight:bold;'>L.${(subtotal*1.13).toFixed(2)}</td></tr>
                    </table>
                </div>
            </div>
            <div style='text-align:center;margin-top:18px;font-size:1.1em;color:#3498db;'>¡Gracias por su compra!</div>
            <button id='imprimir-factura' style='margin-top:15px;padding:8px 18px;background:#3498db;color:#fff;border:none;border-radius:8px;font-size:1em;cursor:pointer;'>Imprimir factura</button>
        </div>`;
        facturaDiv.innerHTML = html;
        facturaDiv.style.display = 'block';

        // Evento para imprimir solo la factura
        document.getElementById('imprimir-factura').onclick = function() {
            const facturaHtml = facturaDiv.innerHTML;
            const ventana = window.open('', '', 'width=700,height=600');
            ventana.document.write('<html><head><title>Factura</title>');
            ventana.document.write('<style>body{font-family:sans-serif;padding:30px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #bfc9d1;padding:8px;}th{background:#3498db;color:#fff;}h3{text-align:center;}img{height:90px;width:auto;max-width:120px;border-radius:12px;margin-right:6px;display:inline-block;vertical-align:middle;} .agradecimiento{text-align:center;margin-top:18px;font-size:1.1em;color:#3498db;}</style>');
            ventana.document.write('</head><body>');
            ventana.document.write(facturaHtml.replace(/<button[^>]*>.*?<\/button>/g, ''));
            ventana.document.write('</body></html>');
            ventana.document.close();
            ventana.focus();
            ventana.print();
            ventana.close();
        };
    });
});