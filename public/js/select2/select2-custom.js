"use strict";
setTimeout(function(){
        (function($) {
            "use strict";
            // Single Search Select
            
            $(".js-example-disabled-results").select2();

            // Multi Select
            $(".js-example-basic-multiple").select2();

            // With Placeholder
            $(".js-example-placeholder-multiple").select2({
                placeholder: "Select Your Name"
            });

            //Limited Numbers
            $(".js-example-basic-multiple-limit").select2({
                maximumSelectionLength: 2
            });

            //RTL Suppoort
            $(".js-example-rtl").select2({
                dir: "rtl"
            });
            // Responsive width Search Select
            $(".js-example-basic-hide-search").select2({
                minimumResultsForSearch: Infinity
            });
            $(".js-example-disabled").select2({
                disabled: true
            });
            $(".js-programmatic-enable").on("click", function() {
                $(".js-example-disabled").prop("disabled", false);
            });
            $(".js-programmatic-disable").on("click", function() {
                $(".js-example-disabled").prop("disabled", true);
            });

            // Generic initializer: style any plain <select> that wasn't already
            // picked up by one of the class-specific initializers above.
            $('select').not('.js-example-disabled-results, .js-example-basic-multiple, .js-example-placeholder-multiple, .js-example-basic-multiple-limit, .js-example-rtl, .js-example-basic-hide-search, .js-example-disabled').each(function() {
                var $el = $(this);
                if ($el.data('select2')) return;
                var opts = { width: '100%' };
                if (!$el.attr('multiple') && $el.find('option').length > 8) {
                    opts.minimumResultsForSearch = Infinity;
                }
                $el.select2(opts);
            });
        })(jQuery);
    }
    ,350);