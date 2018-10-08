$(function () {
	var Student = (function () {
		function Student(firstName, middleInitial, lastName) {
			this.firstName     = firstName;
			this.middleInitial = middleInitial;
			this.lastName      = lastName;
			this.fullName      = firstName + ' ' + middleInitial + ' ' + lastName;
		}

		return Student;
	}());

	function greeter(person) {
		return 'Hello, ' + person.firstName + ' ' + person.lastName;
	}

	var user = new Student('Jane', 'M', 'User');
	console.log(greeter(user));

	const input = {
		x: '1',
		y: 'home2',
		a: 'efefefefef',
		b: '324234'
	};
	const {   x,
			  y,
			  ...z   }     = input;
	console.log(x);
	console.log(y);
	console.log(z);

});
