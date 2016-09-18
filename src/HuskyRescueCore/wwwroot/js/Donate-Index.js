var paypalButton = document.querySelector('.paypal-button');
var submitBtn = document.getElementById('submitButton');

var globalPayPalInstance = {};
var isPaypalInit = false;
var globalHostedInstance = {};
var isHostedInit = false;


function PaymentType() {
    var paymentType = $('select[name="BrainTreePayment.PaymentMethod"]').val();

    switch (paymentType) {
        case '0': // PayPal

            braintree.client.create({
                authorization: $('#clientToken').val()
            },
            function (err, clientInstance) {
                // Creation of any other components...

                braintree.dataCollector.create({
                    client: clientInstance,
                    kount: true
                },
                function (err, dataCollectorInstance) {
                    if (err) {
                        // Handle error in creation of data collector
                        return;
                    }
                    // At this point, you should access the dataCollectorInstance.deviceData value and provide it
                    // to your server, e.g. by injecting it into your form as a hidden input.
                    var deviceData = dataCollectorInstance.deviceData;
                    $('#BrainTreePayment_DeviceData').val(deviceData);
                });
                // Create a PayPal component.
                braintree.paypal.create({
                    client: clientInstance
                },
                function (paypalErr, paypalInstance) {
                    // Stop if there was a problem creating PayPal.
                    // This could happen if there was a network error or if it's incorrectly
                    // configured.
                    if (paypalErr) {
                        console.error('Error creating PayPal:', paypalErr);
                        return;
                    }

                    // Enable the button.
                    paypalButton.removeAttribute('disabled');

                    globalPayPalInstance = paypalInstance;
                    isPaypalInit = true;
                    if (isHostedInit) {
                        isHostedInit = false;
                        globalHostedInstance.teardown(function (teardownErr) {
                            if (teardownErr) {
                                console.error('Could not tear down Paypal Fields!', teardownErr);
                            } else {
                                console.info('Paypal Fields has been torn down!');
                            }
                        });
                    }

                    // When the button is clicked, attempt to tokenize.
                    paypalButton.addEventListener('click', function (event) {
                        paypalButton.setAttribute('disabled', 'disabled');
                        // Because tokenization opens a popup, this has to be called as a result of
                        // customer action, like clicking a button—you cannot call this at any time.
                        paypalInstance.tokenize({
                            flow: 'checkout',
                            intent: 'sale',
                            amount: $('#AmountDonation').val()
                        }, function (tokenizeErr, payload) {
                            paypalButton.removeAttribute('disabled');

                            // Stop if there was an error.
                            if (tokenizeErr) {
                                switch (tokenizeErr.code) {
                                    case 'PAYPAL_POPUP_CLOSED':
                                        console.error('Customer closed PayPal popup.');
                                        break;
                                    case 'PAYPAL_ACCOUNT_TOKENIZATION_FAILED':
                                        console.error('PayPal tokenization failed. See details:', tokenizeErr.details);
                                        break;
                                    case 'PAYPAL_FLOW_FAILED':
                                        console.error('Unable to initialize PayPal flow. Are your options correct?', tokenizeErr.details);
                                        break;
                                    default:
                                        console.error('Error!', tokenizeErr);
                                }
                                return;
                            }

                            // Tokenization succeeded!
                            paypalButton.setAttribute('disabled', true);
                            console.log('Got a nonce! You should submit this to your server.');
                            console.log(payload.nonce);
                            document.querySelector('input[name="BrainTreePayment.Nonce"]').value = payload.nonce;
                        });

                    }, false);

                });
            });

            $('#paypalrow').show();
            $('#creditcardrow').hide();

            $('#BrainTreePayment_PayeeFirstName').rules('remove', 'required');
            $('#BrainTreePayment_PayeeLastName').rules('remove', 'required');
            $('#BrainTreePayment_PayeeAddressStreet1').rules('remove', 'required');
            $('#BrainTreePayment_PayeeAddressCity').rules('remove', 'required');
            $('#BrainTreePayment_PayeeAddressStateId').rules('remove', 'required');
            $('#BrainTreePayment_PayeeAddressPostalCode').rules('remove', 'required');
            break;
        case '1':
            braintree.client.create({
                authorization: $('#clientToken').val()
            },
            function (err, clientInstance) {
                // Creation of any other components...

                braintree.dataCollector.create({
                    client: clientInstance,
                    kount: true
                },
                function (err, dataCollectorInstance) {
                    if (err) {
                        // Handle error in creation of data collector
                        return;
                    }
                    // At this point, you should access the dataCollectorInstance.deviceData value and provide it
                    // to your server, e.g. by injecting it into your form as a hidden input.
                    var deviceData = dataCollectorInstance.deviceData;
                    $('#BrainTreePayment_DeviceData').val(deviceData);
                });

                braintree.hostedFields.create({
                    client: clientInstance,
                    styles: {
                        'input': {
                            'font-size': '14pt'
                        },
                        'input.invalid': {
                            'color': 'red'
                        },
                        'input.valid': {
                            'color': 'green'
                        }
                    },
                    fields: {
                        number: {
                            selector: '#card-number',
                            placeholder: '4111 1111 1111 1111'
                        },
                        cvv: {
                            selector: '#cvv',
                            placeholder: '123'
                        },
                        expirationDate: {
                            selector: '#expiration-date',
                            placeholder: '10 / 2019'
                        }
                    }
                },
                function (hostedFieldsErr, hostedFieldsInstance) {
                    if (hostedFieldsErr) {
                        // Handle error in Hosted Fields creation
                        console.error('Hosted Fields Error', hostedFieldsErr);
                        return;
                    }

                    submitBtn.removeAttribute('disabled');
                    globalHostedInstance = hostedFieldsInstance;
                    isHostedInit = true;
                    if (isPaypalInit) {
                        isPaypalInit = false;
                        globalPayPalInstance.teardown(function (teardownErr) {
                            if (teardownErr) {
                                console.error('Could not tear down Paypal Fields!', teardownErr);
                            } else {
                                console.info('Paypal Fields has been torn down!');
                            }
                        });
                    }

                    document.getElementById('donateForm').addEventListener('submit', function (event) {
                        event.preventDefault();
                        submitBtn.setAttribute('disabled', 'disabled');
                        hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
                            submitBtn.removeAttribute('disabled');
                            if (tokenizeErr) {
                                // Handle error in Hosted Fields tokenization
                                switch (tokenizeErr.code) {
                                    case 'HOSTED_FIELDS_FIELDS_EMPTY':
                                        console.error('All fields are empty! Please fill out the form.');
                                        break;
                                    case 'HOSTED_FIELDS_FIELDS_INVALID':
                                        console.error('Some fields are invalid:', tokenizeErr.details.invalidFieldKeys);
                                        break;
                                    case 'HOSTED_FIELDS_FAILED_TOKENIZATION':
                                        console.error('Tokenization failed server side. Is the card valid?');
                                        break;
                                    case 'HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR':
                                        console.error('Network error occurred when tokenizing.');
                                        break;
                                    default:
                                        console.error('Something bad happened!', tokenizeErr);
                                }
                                return;
                            }

                            // Put `payload.nonce` into the `payment-method-nonce` input, and then
                            // submit the form. Alternatively, you could send the nonce to your server
                            // with AJAX.
                            document.querySelector('input[name="BrainTreePayment.Nonce"]').value = payload.nonce;
                            console.log('Got nonce:', payload.nonce);
                            $('#donateForm').submit();
                        });
                    }, false);
                });
            });

            $('#paypalrow').hide();
            $('#creditcardrow').show();

            $('#BrainTreePayment_PayeeFirstName').rules("add", {
                required: true,
                messages: { required: "first name required" }
            });
            $('#BrainTreePayment_PayeeLastName').rules("add", {
                required: true,
                messages: { required: "last name required" }
            });
            $('#BrainTreePayment_PayeeAddressStreet1').rules("add", {
                required: true,
                messages: { required: "address street required" }
            });
            $('#BrainTreePayment_PayeeAddressCity').rules("add", {
                required: true,
                messages: { required: "address city required" }
            });
            $('#BrainTreePayment_PayeeAddressStateId').rules("add", {
                required: true,
                messages: { required: "address state required" }
            });
            $('#BrainTreePayment_PayeeAddressPostalCode').rules("add", {
                required: true,
                messages: { required: "address ZIP required" }
            });
            break;
    }
}

$('select[name="BrainTreePayment.PaymentMethod"]').change(PaymentType);

PaymentType();
