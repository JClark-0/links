// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



// Okay, Are.na stuff!
let channelSlug = 'cracks-in-everyday-life' // The “slug” is just the end of the URL



// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
	// Target some elements in your HTML:
	// let channelTitle = document.getElementById('channel-title')
	// let channelDescription = document.getElementById('channel-description')
	// let channelCount = document.getElementById('channel-count')
	let channelLink = document.getElementById('channel-link')

	// Then set their content/attributes to our data:
	// channelTitle.innerHTML = data.title
	// channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	// channelCount.innerHTML = data.length
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.getElementById('channel-blocks')

	// Links!
	if (block.class == 'Link') {
		let linkItem =
			`
			<section class="lnk_block">
				<details>
					<div class="lnk_info">
						<a href="${ block.source.url }">${ block.title }</a>
					</div>
						<summary>
							<p>click for links</p>
						</summary>
				</details>
			</section>
			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}


	else if (block.class == 'Image') {
		console.log(block)
		let connectedDate = new Date(block.connected_at);
		let currentDate = new Date();
		let differenceMs = currentDate - connectedDate;
		let daysAgo = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
		let formattedDate = `${connectedDate.getMonth() + 1}.${connectedDate.getDate()}.${connectedDate.getFullYear()}`;
		let imageItem = 
		`
			<section class="img_block">
				<figure class="fg">
					<img src="${ block.image.square.url }" alt="${ block.title }">
					<figcaption class="cap"><h2>${ block.title }s</h2>
						<p>Added <span class="days">${ daysAgo } days ago </span>by ${ block.connected_by_username }</p>
						<p class="date">${ formattedDate }</p>
						<p class="tag">${ block.class }</p>
					</figcaption>	
				</figure>
			</section>
		`
		channelBlocks.insertAdjacentHTML('beforeend', imageItem)
	}


	else if (block.class == 'Text') {
		console.log(block)
		let textItem =
		`
			<section class="txt_block">
				<figure>
					<blockquote>${ block.content }</blockquote>
					<figcaption>${ block.generated_title }
						<p>Added ${ block.connected_at } by ${ block.connected_by_username }</p>
					</figcaption>
				</figure>
			</section>
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
				<section>
					<video controls src="${ block.attachment.url }"></video>
				</section>
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
				<section class="pdf_block">
					<a href="${ block.attachment.url }">
						<figure>
							<img src="${ block.image.large.url }">
							<figcaption>
							${ block.title }
							</figcaption>
						<figure>
					</a>
				</section>
			`
		channelBlocks.insertAdjacentHTML('beforeend', pdfItem)
		}

		// Uploaded audio!
		else if (attachment.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			let audioItem =
				`
				<section>
					<p><em>Audio</em></p>
					<audio controls src="${ block.attachment.url }"></video>
				</section>
				`
			channelBlocks.insertAdjacentHTML('beforeend', audioItem)
			// More on audio: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
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
					<section class="vid_block">
						<p><em>${ block.title }</em></p>
						${ block.embed.html }
						<figcaption>
						<p>Added ${ block.connected_at } by ${ block.connected_by_username }</p>
						</figcaption>
					</section>
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
// let renderUser = (user, container) => { // You can have multiple arguments for a function!
// 	let userAddress =
// 		`
// 		<address>
// 			<img src="${ user.avatar_image.display }">
// 			<h3>${ user.first_name }</h3>
// 			<p><a href="https://are.na/${ user.slug }">Are.na profile ↗</a></p>
// 		</address>
// 		`
// 	container.insertAdjacentHTML('beforeend', userAddress)
// }



// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		console.log(data) // Always good to check your response!
		placeChannelInfo(data) // Pass the data to the first function

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			// console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})

		// Also display the owner and collaborators:
		// let channelUsers = document.getElementById('channel-users') // Show them together
		// data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		// renderUser(data.user, channelUsers)
	})
