<script>
	document.addEventListener('DOMContentLoaded', () => {
		// Get all "navbar-burger" elements
		const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

		// Add a click event on each of them
		navbarBurgers.forEach(el => {
			el.addEventListener('click', () => {
				// Get the target from the "data-target" attribute
				const target = document.getElementById(el.dataset.target);

				// Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
				el.classList.toggle('is-active');
				target.classList.toggle('is-active');

			});
		});
	});
</script>

<button aria-expanded='false' aria-label='menu' class='navbar-burger' data-target='navbarBasicExample'>
	<span aria-hidden='true'></span> <span aria-hidden='true'></span> <span aria-hidden='true'></span>
</button>
