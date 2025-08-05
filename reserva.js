// reserva.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reservationForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const formMessages = document.getElementById('form-messages');

    let currentStep = 1;

    function updateProgress() {
        progressSteps.forEach((step, index) => {
            if (index < currentStep - 1) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === currentStep - 1) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    function showStep(step) {
        steps.forEach(s => s.classList.remove('active'));
        document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
        currentStep = step;
        updateProgress();
    }

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateCurrentStep()) {
                if (currentStep < 4) {
                    showStep(currentStep + 1);
                    if (currentStep === 4) {
                        updateSummary();
                    }
                }
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    });

    function validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        if (currentStep === 1) {
            const telefono = document.getElementById('telefono');
            const identidad = document.getElementById('identidad');
            if (telefono.value && !/^[0-9]{8}$/.test(telefono.value)) {
                telefono.classList.add('error');
                isValid = false;
            }
            if (identidad.value && !/^[0-9]{13}$/.test(identidad.value)) {
                identidad.classList.add('error');
                isValid = false;
            }
        }

        if (currentStep === 2) {
            const llegada = new Date(document.getElementById('llegada').value);
            const salida = new Date(document.getElementById('salida').value);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            if (!document.getElementById('llegada').value || llegada < hoy) {
                document.getElementById('llegada').classList.add('error');
                isValid = false;
            }

            if (!document.getElementById('salida').value || salida <= llegada) {
                document.getElementById('salida').classList.add('error');
                isValid = false;
            }
        }

        if (!isValid) {
            showError('Por favor, completa todos los campos requeridos correctamente.');
        }

        return isValid;
    }

    function calculateTotal() {
        const cabanaSelect = document.getElementById('cabana');
        const huespedes = parseInt(document.getElementById('huespedes').value) || 0;
        const llegada = new Date(document.getElementById('llegada').value);
        const salida = new Date(document.getElementById('salida').value);
        
        let alojamiento = 0;
        if (cabanaSelect.value && !isNaN(llegada) && !isNaN(salida) && salida > llegada) {
            const precioPorNoche = parseInt(cabanaSelect.selectedOptions[0].dataset.precio) || 0;
            const noches = Math.ceil((salida - llegada) / (1000 * 60 * 60 * 24));
            alojamiento = precioPorNoche * noches;
        }

        let servicios = 0;
        const serviciosSeleccionados = document.querySelectorAll('input[name="servicios[]"]:checked');
        serviciosSeleccionados.forEach(servicio => {
            let precioServicio = parseInt(servicio.dataset.precio) || 0;
            if ([
                'tirolesa', 'cascada', 'kayak', 'aves',
                'desayuno', 'almuerzo', 'cena', 'picnic'
            ].includes(servicio.value)) {
                servicios += precioServicio * huespedes;
            } else {
                servicios += precioServicio;
            }
        });

        const subtotal = alojamiento + servicios;
        const iva = subtotal * 0.15;
        const total = subtotal + iva;

        return { alojamiento, servicios, subtotal, iva, total };
    }

    function updateSummary() {
        document.getElementById('summary-nombre').textContent = 
            document.getElementById('nombre').value + ' ' + document.getElementById('apellido').value;
        document.getElementById('summary-email').textContent = document.getElementById('email').value;
        document.getElementById('summary-telefono').textContent = document.getElementById('telefono').value;
        document.getElementById('summary-llegada').textContent = document.getElementById('llegada').value;
        document.getElementById('summary-salida').textContent = document.getElementById('salida').value;
        document.getElementById('summary-huespedes').textContent = document.getElementById('huespedes').value;
        document.getElementById('summary-cabana').textContent = document.getElementById('cabana').selectedOptions[0]?.text || '';

        const serviciosDiv = document.getElementById('summary-servicios');
        serviciosDiv.innerHTML = '';
        const serviciosSeleccionados = document.querySelectorAll('input[name="servicios[]"]:checked');
        if (serviciosSeleccionados.length > 0) {
            serviciosSeleccionados.forEach(servicio => {
                const label = document.querySelector(`label[for="${servicio.id}"]`).textContent;
                serviciosDiv.innerHTML += `<p>• ${label}</p>`;
            });
        } else {
            serviciosDiv.innerHTML = '<p>Ningún servicio adicional</p>';
        }

        const costos = calculateTotal();
        document.getElementById('costo-alojamiento').textContent = `L.${costos.alojamiento.toFixed(2)}`;
        document.getElementById('costo-servicios').textContent = `L.${costos.servicios.toFixed(2)}`;
        document.getElementById('subtotal').textContent = `L.${costos.subtotal.toFixed(2)}`;
        document.getElementById('iva').textContent = `L.${costos.iva.toFixed(2)}`;
        document.getElementById('total').textContent = `L.${costos.total.toFixed(2)}`;
    }
    
    form.addEventListener('change', () => {
        if(currentStep === 4) updateSummary();
    });

    function showError(message) {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.textContent = message;
        formMessages.style.display = 'block';
        setTimeout(() => {
            if(formMessages) formMessages.style.display = 'none';
        }, 5000);
    }

    function showSuccess(message) {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'block';
        successMessage.textContent = message;
        formMessages.style.display = 'block';
    }

    document.getElementById('llegada').min = new Date().toISOString().split("T")[0];

    // Mostrar mensaje solo si la URL tiene ?success=1
    if (window.location.search.includes('success=1')) {
        const mensaje = document.getElementById('mensaje-confirmacion');
        if (mensaje) {
            mensaje.textContent = '¡Reservación agregada exitosamente!';
            mensaje.style.display = 'block';
            setTimeout(() => {
                mensaje.style.display = 'none';
            }, 3000);
        }
    }

    form.addEventListener('submit', function(e) {
        alert('¡Se está enviando el formulario!');
    });
}); 