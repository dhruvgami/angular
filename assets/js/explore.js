(function() {
	plaqueExplore = {
		initexplore: function() {
			$('#id_filters').on('click', function() {
                $('#filterSelectDiv').toggle();
                $(this).toggleClass('filterUpIcon');
            });
			// projectList.initPage();
		},
	};
}).call(this);