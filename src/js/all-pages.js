document.addEventListener("DOMContentLoaded", () => {
	// Init modals
	if ($(".js-openModal").length) {
		$(".js-openModal").click(function (event) {
			$($(this).data("modal")).modal({
				fadeDuration: 300,
				fadeDelay: 0,
				showClose: false,
			});
			return false;
		});

		$(".js-closeModal").click(function () {
			$.modal.close();
		});
	}

	// Input type password
	if ($(".password-control").length) {
		$(".password-control").click(function (e) {
			e.preventDefault();
			let passwordInput = $(this).prev();
			if (passwordInput.attr("type") == "password") {
				$(this).find(".password-control__on").show();
				$(this).find(".password-control__off").hide();
				passwordInput.attr("type", "text");
			} else {
				$(this).find(".password-control__off").show();
				$(this).find(".password-control__on").hide();
				passwordInput.attr("type", "password");
			}
			return false;
		});
	}

	// Input type tel
	if ($("input[type='tel']").length) {
		$("input[type='tel']").inputmask("+38 (099) 999 99 99", {
			showMaskOnHover: false,
			inputmode: "tel",
		});
	}

	// Input type tel with country select
	if ($("#intlTel").length) {
		$("#intlTel").intlTelInput({
			utilsScript: "./libs/intl-tel/js/utils.js",
			initialCountry: "ua",
			nationalMode: false,
			preventInvalidDialCodes: true,
			preferredCountries: ["ua", "us"],
		});

		$(".iti__selected-flag").click(function () {
			let inputWidth = $("#intlTel").parents(".js-input").width();
			$(".iti__country-list").css("width", inputWidth + "px");
		});
	}
});
