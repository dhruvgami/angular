

var countries_states;

function print_country(country_id){
	var option_str = document.getElementById(country_id);
	option_str.length=0;
	option_str.options[0] = new Option('Select Country','');
	option_str.selectedIndex = 0;
	for (var i=0; i<Object.keys(countries_states.countries).length; i++) {
		option_str.options[option_str.length] = new Option((countries_states.countries[Object.keys(countries_states.countries)[i]]).trim(),(Object.keys(countries_states.countries)[i]).trim());
	}
}

function print_state(state_id, country_ISO){
	var option_str = document.getElementById(state_id);
	option_str.length=0;
	option_str.options[0] = new Option('Select State','');
	option_str.selectedIndex = 0;
	if (country_ISO == "" || country_ISO == undefined){
		option_str.options[0] = new Option('Select State','');
		var disable_class = " not-active";
		option_str.className=option_str.className.replace(disable_class,""); // remove the class name
		return;
	}
	else if(countries_states.divisions[country_ISO] == undefined){
		var disable_class = " not-active";
		option_str.className=option_str.className.replace(disable_class,""); // first remove the class name if that already exists
		option_str.className = option_str.className + disable_class; // adding new class name
		option_str.options[0] = new Option('Not applicable','');
		if (state_id == 'state1'){
			option_str.style.border = "1px solid #E1DEDE";
		}
		return;
	}
	else{
		var disable_class = " not-active";
		option_str.className=option_str.className.replace(disable_class,""); // remove the class name
	}
	for (var i=0; i<Object.keys(countries_states.divisions[country_ISO]).length; i++) {
		option_str.options[option_str.length] = new Option((countries_states.divisions[country_ISO][Object.keys(countries_states.divisions[country_ISO])[i]]).trim(),(Object.keys(countries_states.divisions[country_ISO])[i].trim()).trim());
	}
}




function admin_createbuilding_print_country(country_id){
	var option_str = document.getElementById(country_id);
	option_str.length=0;
	option_str.options[0] = new Option('Select Country','');
	option_str.selectedIndex = 0;
	for (var i=0; i<Object.keys(countries_states.countries).length; i++) {
		option_str.options[option_str.length] = new Option((countries_states.countries[Object.keys(countries_states.countries)[i]]).trim(),(Object.keys(countries_states.countries)[i]).trim());
	}


	option_str.onchange = function () {
            admin_createbuilding_print_state('state1',option_str.value);
        };
}

function admin_createbuilding_print_state(state_id, country_ISO){
	var option_str = document.getElementById(state_id);
	option_str.length=0;
	option_str.options[0] = new Option('Select State','');
	option_str.selectedIndex = 0;
	if (country_ISO == "" || country_ISO == undefined){
		option_str.options[0] = new Option('Select State','');
		var disable_class = " not-active";
		option_str.className=option_str.className.replace(disable_class,""); // remove the class name
		return;
	}
	else if(countries_states.divisions[country_ISO] == undefined){
		var disable_class = " not-active";
		option_str.className=option_str.className.replace(disable_class,""); // first remove the class name if that already exists
		option_str.className = option_str.className + disable_class; // adding new class name
		option_str.options[0] = new Option('Not applicable','');
		if (state_id == 'state1'){
			option_str.style.border = "1px solid #E1DEDE";
		}
		return;
	}
	else{
		var disable_class = " not-active";
		option_str.className=option_str.className.replace(disable_class,""); // remove the class name
	}
	for (var i=0; i<Object.keys(countries_states.divisions[country_ISO]).length; i++) {
		option_str.options[option_str.length] = new Option((countries_states.divisions[country_ISO][Object.keys(countries_states.divisions[country_ISO])[i]]).trim(),(Object.keys(countries_states.divisions[country_ISO])[i].trim()).trim());
	}
}




