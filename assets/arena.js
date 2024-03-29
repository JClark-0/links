// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



// Okay, Are.na stuff!
let channelSlug = 'cracks-in-everyday-life' // The “slug” is just the end of the URL



// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
	console.log(data);
	// Target some elements in your HTML:
	// let channelTitle = document.getElementById('channel-title')
	let channelDescription = document.getElementById('channel-description')
	let channelCount = document.getElementById('channel-count')
	let channelLink = document.getElementById('channel-link')

	// Then set their content/attributes to our data:
	// channelTitle.innerHTML = data.title
	channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	channelCount.innerHTML = data.length
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}

// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {


	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.getElementById('channel-blocks')


	// Date Format
	let connectedDate = new Date(block.connected_at);
	let currentDate = new Date();
	let differenceMs = currentDate - connectedDate;
	let daysAgo = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
	let formattedDate = `${connectedDate.getMonth() + 1}.${connectedDate.getDate()}.${connectedDate.getFullYear()}`;


	// Links!
	if (block.class == 'Link') {

		let linkItem =
			`
			<li class="lnk_block">
				<details>
					<div>
						<a class="outwards" href="${ block.source.url }">${ block.title }</a>
						<p>Added <span class="days">${ daysAgo } days ago </span>by ${ block.connected_by_username }</p>
					</div>
					<summary>
						<figure class="reg_fg">
							<img class="img_thumb" src="${ block.image.square.url }" alt="${ block.title }">
							<figcaption class="cap">
									<p class="date">${ formattedDate }</p>
									<img class="icon_small add" src ="assets/media/icons//SVG/icon2.svg" alt="Link key"> 
							</figcaption>
						</figure>
					</summary>
				</details>
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}


	else if (block.class == 'Image') {

		let imageItem = 
		`
		<li class="img_block">
				<details>
					<div>
						<p>Added <span class="days">${ daysAgo } days ago </span>by ${ block.connected_by_username }</p>
					</div>
					<summary>
						<figure class="reg_fg">
							<img class="img_thumb" src="${ block.image.square.url }" alt="${ block.title }">
							<figcaption class="cap">
								<p class="date">${ formattedDate }</p>
								<img class="icon_small add" src ="assets/media/icons//SVG/icon1.svg" alt="Image key">
							</figcaption>	
						</figure>
					</summary>
				</details>
			</li>
		`
		channelBlocks.insertAdjacentHTML('beforeend', imageItem)
		console.log(block);
	}


	else if (block.class == 'Text') {

		let textItem =

		`
			<li class="txt_block">
				<details>
				<div>
					<p>Added <span class="days">${ daysAgo } days ago </span>by ${ block.connected_by_username }</p>
				</div>
				<summary>
					<figure class="reg_fg">
						<blockquote>${ block.content }
							<p class="txt_note"> - ${ block.generated_title }</p>
						</blockquote>
						<figcaption class="cap">
								<p class="date">${ formattedDate }</p>
								<img class="icon_small add" src ="assets/media/icons//SVG/icon5.svg" alt="Quote key"> 
						</figcaption>
					</figure>
				</summary>
			</details>
			</li>
		`

	
		
		channelBlocks.insertAdjacentHTML('beforeend', textItem)

	}

	// // Uploaded (not linked) media…
	else if (block.class == 'Attachment') {
		let attachment = block.attachment.content_type // Save us some repetition

		// Uploaded videos!
		if (attachment.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			let videoItem =
				`
				<li class="vid_block">
					<details>
						<div>
							<p>Added <span class="days">${ daysAgo } days ago </span>by ${ block.connected_by_username }</p>
						</div>
						<summary>
							<figure class="reg_fg">
								<video controls src="${ block.attachment.url }"></video>
								<figcaption class="cap">
									<p class="date">${ formattedDate }</p>
									<img class="icon_small add" src ="assets/media/icons//SVG/icon8.svg" alt="Video key"> 
								</figcaption>
							</figure>
						</summary>
					</details>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
			// More on video, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}

		// Uploaded PDFs!
		else if (attachment.includes('pdf')) {
			// …up to you!
			let pdfItem =
			`
				<li class="pdf_block">
					<details>
					<div>
						<a class="outwards" href="${ block.attachment.url }">${ block.title }</a>
						<p>Added <span class="days">${ daysAgo } days ago </span>by ${ block.connected_by_username }</p>

					</div>
					<summary>
						<figure class="reg_fg">
							<img class="img_thumb" src="${ block.image.square.url }" alt="${ block.title }">
							<figcaption class="cap">
								<p class="date">${ formattedDate }</p>
								<img class="icon_small add" src ="assets/media/icons//SVG/icon3.svg" alt="PDF key"> 
							</figcaption>	
						</figure>
					</summary>
				</details>
				</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', pdfItem)

		}


		// Uploaded audio!
		else if (attachment.includes('audio')) {
			let audioItem =
				`
				<li class="aud_block">
					<details>
						<div>
							<p>Added <span class="days">${ daysAgo } days ago </span>by ${ block.connected_by_username }</p>
						</div>
						<summary>
							<figure class="reg_fg">
								<img class="img_thumb" src='assets/media/audio.png'>
								<audio controls src="${ block.attachment.url }"></audio>
								<figcaption class="cap">
									<p class="date">${ formattedDate }</p>
									<img class="icon_small add" src ="assets/media/icons/SVG/icon4.svg" alt="Audio key"> 
								</figcaption
							</figure>
						</summary>
					</details>
			</li>
			`
			channelBlocks.insertAdjacentHTML('beforeend', audioItem)
		
		}
	}

	// Linked media…
	else if (block.class == 'Media') {
		let embed = block.embed.type

		// Linked video!
		if (embed.includes('video')) {
			// …still up to you, but here’s an example `iframe` element:
			let linkedVideoItem =
			`
			<li class="vid_block">
				<details>
					<div>
						<p>Added <span class="days">${ daysAgo } days ago </span>by ${ block.connected_by_username }</p>
					</div>
					<summary>
						<figure class="reg_fg">
							${ block.embed.html }
							<figcaption class="cap">
								<p class="date">${ formattedDate }</p>
								<img class="icon_small add" src ="assets/media/icons//SVG/icon8.svg" alt="Video key"> 
							</figcaption>
						</figure>
					</summary>
				</details>
			</li>
			`


			channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)
			// More on iframe: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
		}

		// Linked audio!
		else if (embed.includes('rich')) {
			// …up to you!s
		}
	}
}



// // It‘s always good to credit your work:
let renderUser = (user, container) => { // You can have multiple arguments for a function!
	let userAddress =
		`
		<address>
			<h3>${ user.first_name }</h3>
			<a class="outwards" href="https://are.na/${ user.slug }">Are.na Profile</a>
		</address>
		`
	container.insertAdjacentHTML('beforeend', userAddress)
}



// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		// console.log(data) // Always good to check your response!
		placeChannelInfo(data) // Pass the data to the first function

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			// console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})

		// Also display the owner and collaborators:
		let channelUsers = document.getElementById('channel-users') // Show them together
		data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		renderUser(data.user, channelUsers)

		//Scroll Behaviour
		let highlightClass = 'highlight' // Variables again.
		let highlightBlocks = document.querySelectorAll('li') // Get all of them.
		// Loop through the list, doing this `forEach` one.
		highlightBlocks.forEach((block) => {
			let sectionObserver = new IntersectionObserver((entries) => {
				let [entry] = entries
		
				if (entry.isIntersecting) {
					block.classList.remove(highlightClass)
				} else {
					block.classList.add(highlightClass)
				}
			}, {
				rootMargin: '-50% 0% -50% 0%', // CSS-ish: top/right/bottom/left.
			})
		
			sectionObserver.observe(block) // Watch each one!
		})

		let clickedClass = 'clicked';
		let switchButtons = document.querySelector('#webCrack');
		
		switchButtons.onclick = () => {
			// Toggle the class for the clicked button
			switchButtons.classList.toggle(clickedClass);
	
			if (switchButtons.classList.contains(clickedClass)) {
				switchButtons.textContent = 'cracked';
			} else {
				switchButtons.textContent = 'crack';
			}
	
			let channelDescription = document.getElementById('channel-description');
		if (switchButtons.classList.contains(clickedClass)) {
			channelDescription.innerHTML = 'channelDescription.innerHTML = window.markdownit().render (data.metadata.description) channelDescription.innerHTML = window.markdownit().render (data.metadata.description) channelDescription.innerHTML = window.markdownit().render (data.metadata.description)';
			channelDescription.style.fontFamily ='monospace';
		} else {
			channelDescription.innerHTML = 'Whenever I find a moment of error in the city, I feel weirdly relieved. I think even in a city that seems too perfect without any room to fit in people like me can live and make a mistake. I enjoy exploring the city and discovering random street scenes. I imagine interesting stories from abandoned items and find humor in the moment of error.';
			channelDescription.style.fontFamily ='Poppins';
		}
	
		};

	});

	//button add remove on scroll position
	const btnTop = document.querySelector(".top");
	window.addEventListener("scroll", () => {
		if (window.scrollY > 300) {
			btnTop.classList.add("active");
		} else {
			btnTop.classList.remove("active");
		}
	});


	document.onclick = userClicked;
	function userClicked() {
		var x = event.clientX;
		var y = event.clientY;
		var crackAppear = document.getElementById("mouseCrack");
		crackAppear.style.display = 'block';
		crackAppear.style.position = 'absolute';
		crackAppear.style.left = x + 'px';
		crackAppear.style.top = y + 'px';
	
		var imageWidth = crackAppear.offsetWidth;
		var imageHeight = crackAppear.offsetHeight;
		var xOffset = imageWidth / 2;
		var yOffset = imageHeight / 2;
		
		// Adjust the image position so that its center aligns with the mouse coordinates
		crackAppear.style.left = (x - xOffset) + 'px';
		crackAppear.style.top = (y - yOffset) + 'px';
	
		toggleCrack();
	
	}
	
	
	function toggleCrack() {
		var img = document.getElementById('mouseCrack');
		img.classList.toggle('fade-out');
	}




	

	// var crackImages = [
	// 	'assets/media/crack.png',
	// 	'assets/media/crack2.png',
	// 	'assets/media/crack3.png',

	// ];

	// //button add remove on scroll position
	// var introBlocks = document.querySelectorAll('.intro_blocks');

	// introBlocks.forEach(function(element) {
	// 	element.addEventListener('click', function() {
	// 		replaceContentWithCrackImage(element);
	// 	});
	// });
	
	// function replaceContentWithCrackImage(element) {

	// 	var imageElement = element.querySelector('.icon');

	// 	var randomIndex = Math.floor(Math.random() * crackImages.length);
		
	// 	// Replace the image source with the crack image
	// 	imageElement.src = crackImages[randomIndex];
	// 	imageElement.alt = 'Crack'; 
	// 	imageElement.style.width = '100%';
	// 	imageElement.style.height = 'auto'; 
	// }

	// document.getElementById("webCrack").addEventListener("click", myFunction)
	// function myFunction() {
	// 	document.getElementById("webCrack").innerHTML = "cracked";
	//   }


