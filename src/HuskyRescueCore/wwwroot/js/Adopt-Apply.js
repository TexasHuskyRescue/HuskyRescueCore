
var paypalButton = document.querySelector('.paypal-button');

braintree.client.create({
    authorization: $('#clientToken').val()
}, function (err, clientInstance) {
    // Creation of any other components...

    braintree.dataCollector.create({
        client: clientInstance,
        kount: true
    }, function (err, dataCollectorInstance) {
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
    }, function (hostedFieldsErr, hostedFieldsInstance) {
        if (hostedFieldsErr) {
            // Handle error in Hosted Fields creation
            return;
        }

        //submit.removeAttribute('disabled');

        document.getElementById('applyForm').addEventListener('submit', function (event) {
            event.preventDefault();

            hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
                if (tokenizeErr) {
                    // Handle error in Hosted Fields tokenization
                    return;
                }

                // Put `payload.nonce` into the `payment-method-nonce` input, and then
                // submit the form. Alternatively, you could send the nonce to your server
                // with AJAX.
                document.querySelector('input[name="payment-method-nonce"]').value = payload.nonce;
                document.querySelector('input[name="BrainTreePayment.Nonce"]').value = payload.nonce;
                
                $('#applyForm').submit();
            });
        }, false);
    });

    // Create a PayPal component.
    braintree.paypal.create({
        client: clientInstance
    }, function (paypalErr, paypalInstance) {

        // Stop if there was a problem creating PayPal.
        // This could happen if there was a network error or if it's incorrectly
        // configured.
        if (paypalErr) {
            console.error('Error creating PayPal:', paypalErr);
            return;
        }

        // Enable the button.
        paypalButton.removeAttribute('disabled');

        // When the button is clicked, attempt to tokenize.
        paypalButton.addEventListener('click', function (event) {

            // Because tokenization opens a popup, this has to be called as a result of
            // customer action, like clicking a button—you cannot call this at any time.
            paypalInstance.tokenize({
                flow: 'vault'
            }, function (tokenizeErr, payload) {

                // Stop if there was an error.
                if (tokenizeErr) {
                    if (tokenizeErr.type !== 'CUSTOMER') {
                        console.error('Error tokenizing:', tokenizeErr);
                    }
                    return;
                }

                // Tokenization succeeded!
                paypalButton.setAttribute('disabled', true);
                console.log('Got a nonce! You should submit this to your server.');
                console.log(payload.nonce);
                document.querySelector('input[name="payment-method-nonce"]').value = payload.nonce;
                document.querySelector('input[name="BrainTreePayment.Nonce"]').value = payload.nonce;
            });

        }, false);

    });
});

/*
braintree.setup($('#clientToken').val(),
    'custom',
    {
        id: 'applyForm',
        onError: function (response) {
            console.log('braintree onError: [type=' + response.type + '][message=' + response.message + ']');
            $('option:not(:selected)').prop('disabled', false);
            $('input[name="payment_method_nonce"]').val('');
        },
        onPaymentMethodReceived: function (response) {
            // performed when submitting the form
            console.log('braintree onPaymentMethodReceived: [nonce=' + response.nonce + '][type=' + response.type + '][details=' + response.details.cardType + ' -- ' + response.details.lastTwo + ']');

            if (response.details.cardType !== 'Unknown' && response.nonce !== '' && $('input[name="payment_method_nonce"]')) {
                $('input[name="payment_method_nonce"]').val(response.nonce);

                var isValid = $('#applyForm').valid();
                if (isValid) {
                    $.blockUI({
                        css: {
                            border: 'none',
                            padding: '15px',
                            backgroundColor: '#000',
                            '-webkit-border-radius': '10px',
                            '-moz-border-radius': '10px',
                            opacity: .5,
                            color: '#fff'
                        }
                    });
                    $('#applyForm').submit();
                }
            }
            else if ($('input[name="payment_method_nonce"]')) {
                $('input[name="payment_method_nonce"]').val('');
            }
        },
        paypal: {
            container: 'paypal-button',
            singleUse: true,
            amount: parseFloat($('#ApplicationFeeAmountReadOnly')),
            currency: 'USD',
            onSuccess: function (nonce, email) {
                // This will be called as soon as the user completes the PayPal flow
                console.log('paypal onSuccess');
                $('option:not(:selected)').prop('disabled', true);

                if (nonce !== '' && $('input[name="payment_method_nonce"]')) {
                    $('input[name="payment_method_nonce"]').val(nonce);
                }
                // set paypal email to email address on form if one has not been provided already
                if (email !== '' && $('input[name="Email"]').val() !== '') {
                    $('input[name="Email"]').val(email);
                }
            },
            onCancelled: function () {
                console.log('paypal onCancelled');
                $('option:not(:selected)').prop('disabled', false);
                $('input[name="payment_method_nonce"]').val('');
            },
            onUnsupported: function () {
                console.log('paypal onUnsupported');
                $('option:not(:selected)').prop('disabled', false);
                $('input[name="payment_method_nonce"]').val('');
            }
        }
    });

var env = $('#environment').val() === true ? BraintreeData.environments.production : BraintreeData.environments.sandbox;
BraintreeData.setup($('#merchantId').valueOf(), 'applyForm', env);
*/
function PaymentType() {
    var paymentType = $('select[name="BrainTreePayment.PaymentMethod"]').val();

    switch (paymentType) {
        case '0':
            $('#paypalrow').show();
            $('#creditcardrow').hide();
            break;
        case '1':
            $('#paypalrow').hide();
            $('#creditcardrow').show();
            break;
    }
}

$('select[name="BrainTreePayment.PaymentMethod"]').change(PaymentType);
PaymentType();


$('#IsAllAdultsAgreedOnAdoptionReason_div').hide();
$('input[name="IsAllAdultsAgreedOnAdoption"]').click(function () {
    if ($('input[name="IsAllAdultsAgreedOnAdoption"]:checked').val() === 'true') {
        $('#IsAllAdultsAgreedOnAdoptionReason_div').hide();
    } else {
        $('#IsAllAdultsAgreedOnAdoptionReason_div').show();
    }
});

$('.ResidenceRent').hide();
$('#ResidenceOwnershipId').change(function () {
    if ($('#ResidenceOwnershipId').val() === '2') {
        $('.ResidenceRent').show();
        $('#ResidenceIsPetAllowed').rules("add", {
            required: true,
            messages: { required: "is pet allowed required" }
        });
        $('#ResidenceIsPetDepositRequired').rules("add", {
            required: true,
            messages: { required: "is pet deposit required" }
        });
        $('#ResidencePetSizeWeightLimit').rules("add", {
            required: true,
            messages: { required: "is pet weight limit required" }
        });
    } else {
        $('.ResidenceRent').hide();
        $('#ResidenceIsPetAllowed').rules('remove', 'required');
        $('#ResidenceIsPetDepositRequired').rules('remove', 'required');
        $('#ResidencePetSizeWeightLimit').rules('remove', 'required');
    }
});

$('.ResidencePetDeposit').hide();
$('input[name="ResidenceIsPetDepositRequired"]').click(function () {
    if ($('input[name="ResidenceIsPetDepositRequired"]:checked').val() === 'false') {
        $('.ResidencePetDeposit').hide();
        $('#ResidencePetDepositAmount').rules('remove', 'required');
        $('#ResidenceIsPetDepositPaid').rules('remove', 'required');
        $('#ResidencePetDepositCoverageId').rules('remove', 'required');
    } else {
        $('.ResidencePetDeposit').show();
        $('#ResidencePetDepositAmount').rules("add", {
            required: true,
            messages: { required: "pet deposit amount required" }
        });
        $('#ResidenceIsPetDepositPaid').rules("add", {
            required: true,
            messages: { required: "is pet deposit paid required" }
        });
        $('#ResidencePetDepositCoverageId').rules("add", {
            required: true,
            messages: { required: "pet deposit coverage required" }
        });
    }
});

$('.ResidenceFence').hide();
$('input[name="ResidenceIsYardFenced"]').click(function () {
    if ($('input[name="ResidenceIsYardFenced"]:checked').val() === 'false') {
        $('.ResidenceFence').hide();
        $('#ResidenceFenceTypeHeight').rules('remove', 'required');
    } else {
        $('.ResidenceFence').show();
        $('#ResidenceFenceTypeHeight').rules("add", {
            required: true,
            messages: { required: "fence type and height are required" }
        });
    }
});

$('.StudentType').hide();
$('input[name="IsAppOrSpouseStudent"]').click(function () {
    if ($('input[name="IsAppOrSpouseStudent"]:checked').val() === 'false') {
        $('.StudentType').hide();
        $('#StudentTypeId').rules('remove', 'required');
    } else {
        $('.StudentType').show();
        $('#StudentTypeId').rules("add", {
            required: true,
            messages: { required: "student type is required" }
        });
    }
});

$('.TravelFrequent').hide();
$('input[name="IsAppTravelFrequent"]').click(function () {
    if ($('input[name="IsAppTravelFrequent"]:checked').val() === 'false') {
        $('.TravelFrequent').hide();
        $('#AppTravelFrequency').rules('remove', 'required');
    } else {
        $('.TravelFrequent').show();
        $('#AppTravelFrequency').rules("add", {
            required: true,
            messages: { required: "travel frequency is required" }
        });
    }
});

$('.CatOwner').hide();
$('input[name="FilterAppIsCatOwner"]').click(function () {
    if ($('input[name="FilterAppIsCatOwner"]:checked').val() === 'false') {
        $('.CatOwner').hide();
        $('#FilterAppCatsOwnedCount').rules('remove', 'required');
    } else {
        $('.CatOwner').show();
        $('#FilterAppCatsOwnedCount').rules("add", {
            required: true,
            messages: { required: "number of cats owned is required" }
        });
    }
});

function CheckVetRequired() {
    if($('#Name1').val() !== '' ||
       $('#Name2').val() !== '' ||
       $('#Name3').val() !== '' ||
       $('#Name4').val() !== '' ||
       $('#Name5').val() !== '')
    {
        $('#VeterinarianOfficeName').rules("add", {
            required: true,
            messages: { required: "vet office name is required" }
        });
        $('#VeterinarianDoctorName').rules("add", {
            required: true,
            messages: { required: "vet doctor name is required" }
        });
        $('#PhoneNumber').rules("add", {
            required: true,
            messages: { required: "vet phone number is required" }
        });
    }
    else {
        $('#VeterinarianOfficeName').rules('remove', 'required');
        $('#VeterinarianDoctorName').rules('remove', 'required');
        $('#PhoneNumber').rules('remove', 'required');
    }
}

$('.Pet1').hide();
$('.Pet1Alter').hide();
$('.Pet1HW').hide();
$('.Pet1Vacc').hide();
$('.Pet1StillOwned').hide();

$('#Name1').change(function () {
    if ($('#Name1').val() !== '') {
        $('.Pet1').show();
    } else {
        $('.Pet1').hide();
        $('.Pet1Alter').hide();
        $('.Pet1HW').hide();
        $('.Pet1Vacc').hide();
        $('.Pet1StillOwned').hide();
    }
});
$('#Name1').blur(function () {
    if ($('#Name1').val() !== '') {
        $('#Breed1').focus();
    } else {
        $('#Name2').focus();
    }
});

$('input[name="IsAltered1"]').click(function () {
    if ($('input[name="IsAltered1"]:checked').val() === 'false') {
        $('.Pet1Alter').show();
        $('#AlteredReason1').rules("add", {
            required: true,
            messages: { required: "non-altered reason is required" }
        });
    } else {
        $('.Pet1Alter').hide();
        $('#AlteredReason1').rules('remove', 'required');
    }
});
$('input[name="IsHwPrevention1"]').click(function () {
    if ($('input[name="IsHwPrevention1"]:checked').val() === 'false') {
        $('.Pet1HW').show();
        $('#HwPreventionReason1').rules("add", {
            required: true,
            messages: { required: "not on HW prevention reason is required" }
        });
    } else {
        $('.Pet1HW').hide();
        $('#HwPreventionReason1').rules('remove', 'required');
    }
});
$('input[name="IsFullyVaccinated1"]').click(function () {
    if ($('input[name="IsFullyVaccinated1"]:checked').val() === 'false') {
        $('.Pet1Vacc').show();
        $('#FullyVaccinatedReason1').rules("add", {
            required: true,
            messages: { required: "non-vaccinated reason is required" }
        });
    } else {
        $('.Pet1Vacc').hide();
        $('#FullyVaccinatedReason1').rules('remove', 'required');
    }
});
$('input[name="IsStillOwned1"]').click(function () {
    if ($('input[name="IsStillOwned1"]:checked').val() === 'false') {
        $('.Pet1StillOwned').show();
        $('#IsStillOwnedReason1').rules("add", {
            required: true,
            messages: { required: "reason for not owning is required" }
        });
    } else {
        $('.Pet1StillOwned').hide();
        $('#IsStillOwnedReason1').rules('remove', 'required');
    }
});

$('.Pet2').hide();
$('.Pet2Alter').hide();
$('.Pet2HW').hide();
$('.Pet2Vacc').hide();
$('.Pet2StillOwned').hide();
$('#Name2').change(function () {
    if ($('#Name2').val() !== '') {
        $('.Pet2').show();
    } else {
        $('.Pet2').hide();
        $('.Pet2Alter').hide();
        $('.Pet2HW').hide();
        $('.Pet2Vacc').hide();
        $('.Pet2StillOwned').hide();
    }
});
$('#Name2').blur(function () {
    if ($('#Name2').val() !== '') {
        $('#Breed2').focus();
    } else {
        $('#Name3').focus();
    }
});

$('input[name="IsAltered2"]').click(function () {
    if ($('input[name="IsAltered2"]:checked').val() === 'false') {
        $('.Pet2Alter').show();
        $('#AlteredReason2').rules("add", {
            required: true,
            messages: { required: "non-altered reason is required" }
        });
    } else {
        $('.Pet2Alter').hide();
        $('#AlteredReason2').rules('remove', 'required');
    }
});
$('input[name="IsHwPrevention2"]').click(function () {
    if ($('input[name="IsHwPrevention2"]:checked').val() === 'false') {
        $('.Pet2HW').show();
        $('#HwPreventionReason2').rules("add", {
            required: true,
            messages: { required: "not on HW prevention reason is required" }
        });
    } else {
        $('.Pet2HW').hide();
        $('#HwPreventionReason2').rules('remove', 'required');
    }
});
$('input[name="IsFullyVaccinated2"]').click(function () {
    if ($('input[name="IsFullyVaccinated2"]:checked').val() === 'false') {
        $('.Pet2Vacc').show();
        $('#FullyVaccinatedReason2').rules("add", {
            required: true,
            messages: { required: "non-vaccinated reason is required" }
        });
    } else {
        $('.Pet2Vacc').hide();
        $('#FullyVaccinatedReason2').rules('remove', 'required');
    }
});
$('input[name="IsStillOwned2"]').click(function () {
    if ($('input[name="IsStillOwned2"]:checked').val() === 'false') {
        $('.Pet2StillOwned').show();
        $('#IsStillOwnedReason2').rules("add", {
            required: true,
            messages: { required: "reason for not owning is required" }
        });
    } else {
        $('.Pet2StillOwned').hide();
        $('#IsStillOwnedReason2').rules('remove', 'required');
    }
});

$('.Pet3').hide();
$('.Pet3Alter').hide();
$('.Pet3HW').hide();
$('.Pet3Vacc').hide();
$('.Pet3StillOwned').hide();
$('#Name3').change(function () {
    if ($('#Name3').val() !== '') {
        $('.Pet3').show();
    } else {
        $('.Pet3').hide();
        $('.Pet3Alter').hide();
        $('.Pet3HW').hide();
        $('.Pet3Vacc').hide();
        $('.Pet3StillOwned').hide();
    }
});
$('#Name3').blur(function () {
    if ($('#Name3').val() !== '') {
        $('#Breed3').focus();
    } else {
        $('#Name4').focus();
    }
});

$('input[name="IsAltered3"]').click(function () {
    if ($('input[name="IsAltered3"]:checked').val() === 'false') {
        $('.Pet3Alter').show();
        $('#AlteredReason3').rules("add", {
            required: true,
            messages: { required: "non-altered reason is required" }
        });
    } else {
        $('.Pet3Alter').hide();
        $('#AlteredReason3').rules('remove', 'required');
    }
});
$('input[name="IsHwPrevention3"]').click(function () {
    if ($('input[name="IsHwPrevention3"]:checked').val() === 'false') {
        $('.Pet3HW').show();
        $('#HwPreventionReason3').rules("add", {
            required: true,
            messages: { required: "not on HW prevention reason is required" }
        });
    } else {
        $('.Pet3HW').hide();
        $('#HwPreventionReason3').rules('remove', 'required');
    }
});
$('input[name="IsFullyVaccinated3"]').click(function () {
    if ($('input[name="IsFullyVaccinated3"]:checked').val() === 'false') {
        $('.Pet3Vacc').show();
        $('#FullyVaccinatedReason3').rules("add", {
            required: true,
            messages: { required: "non-vaccinated reason is required" }
        });
    } else {
        $('.Pet3Vacc').hide();
        $('#FullyVaccinatedReason3').rules('remove', 'required');
    }
});
$('input[name="IsStillOwned3"]').click(function () {
    if ($('input[name="IsStillOwned3"]:checked').val() === 'false') {
        $('.Pet3StillOwned').show();
        $('#IsStillOwnedReason3').rules("add", {
            required: true,
            messages: { required: "reason for not owning is required" }
        });
    } else {
        $('.Pet3StillOwned').hide();
        $('#IsStillOwnedReason3').rules('remove', 'required');
    }
});

$('.Pet4').hide();
$('.Pet4Alter').hide();
$('.Pet4HW').hide();
$('.Pet4Vacc').hide();
$('.Pet4StillOwned').hide();
$('#Name4').change(function () {
    if ($('#Name4').val() !== '') {
        $('.Pet4').show();
    } else {
        $('.Pet4').hide();
        $('.Pet4Alter').hide();
        $('.Pet4HW').hide();
        $('.Pet4Vacc').hide();
        $('.Pet4StillOwned').hide();
    }
});
$('#Name4').blur(function () {
    if ($('#Name4').val() !== '') {
        $('#Breed4').focus();
    } else {
        $('#Name5').focus();
        $('#IsStillOwnedReason4').rules('remove', 'required');
    }
});

$('input[name="IsAltered4"]').click(function () {
    if ($('input[name="IsAltered4"]:checked').val() === 'false') {
        $('.Pet4Alter').show();
        $('#AlteredReason4').rules("add", {
            required: true,
            messages: { required: "non-altered reason is required" }
        });
    } else {
        $('.Pet4Alter').hide();
        $('#AlteredReason4').rules('remove', 'required');
    }
});
$('input[name="IsHwPrevention4"]').click(function () {
    if ($('input[name="IsHwPrevention4"]:checked').val() === 'false') {
        $('.Pet4HW').show();
        $('#HwPreventionReason4').rules("add", {
            required: true,
            messages: { required: "not on HW prevention reason is required" }
        });
    } else {
        $('.Pet4HW').hide();
        $('#HwPreventionReason4').rules('remove', 'required');
    }
});
$('input[name="IsFullyVaccinated4"]').click(function () {
    if ($('input[name="IsFullyVaccinated4"]:checked').val() === 'false') {
        $('.Pet4Vacc').show();
        $('#FullyVaccinatedReason4').rules("add", {
            required: true,
            messages: { required: "non-vaccinated reason is required" }
        });
    } else {
        $('.Pet4Vacc').hide();
        $('#FullyVaccinatedReason4').rules('remove', 'required');
    }
});
$('input[name="IsStillOwned4"]').click(function () {
    if ($('input[name="IsStillOwned4"]:checked').val() === 'false') {
        $('.Pet4StillOwned').show();
        $('#IsStillOwnedReason4').rules("add", {
            required: true,
            messages: { required: "reason for not owning is required" }
        });
    } else {
        $('.Pet4StillOwned').hide();
        $('#IsStillOwnedReason4').rules('remove', 'required');
    }
});

$('.Pet5').hide();
$('.Pet5Alter').hide();
$('.Pet5HW').hide();
$('.Pet5Vacc').hide();
$('.Pet5StillOwned').hide();
$('#Name5').change(function () {
    if ($('#Name5').val() !== '') {
        $('.Pet5').show();
    } else {
        $('.Pet5').hide();
        $('.Pet5Alter').hide();
        $('.Pet5HW').hide();
        $('.Pet5Vacc').hide();
        $('.Pet5StillOwned').hide();
    }
});
$('#Name5').blur(function () {
    if ($('#Name5').val() !== '') {
        $('#Breed5').focus();
    } else {
        $('#submitButton').focus();
    }
});

$('input[name="IsAltered5"]').click(function () {
    if ($('input[name="IsAltered5"]:checked').val() === 'false') {
        $('.Pet5Alter').show();
        $('#AlteredReason5').rules("add", {
            required: true,
            messages: { required: "non-altered reason is required" }
        });
    } else {
        $('.Pet5Alter').hide();
        $('#AlteredReason5').rules('remove', 'required');
    }
});
$('input[name="IsHwPrevention5"]').click(function () {
    if ($('input[name="IsHwPrevention5"]:checked').val() === 'false') {
        $('.Pet5HW').show();
        $('#HwPreventionReason5').rules("add", {
            required: true,
            messages: { required: "not on HW prevention reason is required" }
        });
    } else {
        $('.Pet5HW').hide();
        $('#HwPreventionReason5').rules('remove', 'required');
    }
});
$('input[name="IsFullyVaccinated5"]').click(function () {
    if ($('input[name="IsFullyVaccinated5"]:checked').val() === 'false') {
        $('.Pet5Vacc').show();
        $('#FullyVaccinatedReason5').rules("add", {
            required: true,
            messages: { required: "non-vaccinated reason is required" }
        });
    } else {
        $('.Pet5Vacc').hide();
        $('#FullyVaccinatedReason5').rules('remove', 'required');
    }
});
$('input[name="IsStillOwned5"]').click(function () {
    if ($('input[name="IsStillOwnedReason5"]:checked').val() === 'false') {
        $('.Pet5StillOwned').show();
        $('#IsStillOwnedReason5').rules("add", {
            required: true,
            messages: { required: "reason for not owning is required" }
        });
    } else {
        $('.Pet5StillOwned').hide();
        $('#IsStillOwnedReason5').rules('remove', 'required');
    }
});
