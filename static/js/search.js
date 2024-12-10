// Adding functionality for image search

document.getElementById('imageSearchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    fetch('/search/image', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Call the displayResults function to process and display the results
        displayResults(data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while searching. Please try again.');
    });
});

document.getElementById('imageInput').addEventListener('change', function() {
    var fileName = this.files[0] ? this.files[0].name : '';
    var label = document.querySelector('.custom-file-label');
    label.textContent = fileName || 'Choose an image...';
});

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found</p>';
        return;
    }

    results.slice(0, 12).forEach((result) => {
        const item = document.createElement('div');
        item.className = 'col-lg-4 col-md-6 col-sm-6';

        item.innerHTML = `
            <div class="product__item">
                <div class="product__item__pic set-bg" style="background-image: url(${result.image_url});">
                    <ul class="product__hover">
                        <li><a href="#"><img  src="{{ url_for('static', filename='img/icon/heart.png') }}"  alt=""></a></li>
                        <li><a href="#"><img  src="{{ url_for('static', filename='img/icon/compare.png') }}"  alt=""> <span>Compare</span></a></li>
                        <li><a href="#"><img  src="{{ url_for('static', filename='img/icon/search.png') }}"  alt=""></a></li>
                    </ul>
                </div>
                <div class="product__item__text">
                    <h6>${result.name}</h6>
                    <a href="${result.link}" class="add-cart" target="_blank">+ View Details</a>
                    <div class="rating">
                        ${'<i class="fa fa-star"></i>'.repeat(result.rating)}
                        ${'<i class="fa fa-star-o"></i>'.repeat(5 - result.rating)}
                    </div>
                    <h5>$${result.price}</h5>
                </div>
            </div>
        `;
        resultsContainer.appendChild(item);
    });
}

function searchProducts(clothingName) {
    fetch(`/search/name?query=${encodeURIComponent(clothingName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while searching. Please try again.');
        });
}

function voiceSearch() {
    const voiceSearchButton = document.getElementById('voice-search-button');
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    voiceSearchButton.addEventListener('click', () => {
        recognition.start();
    });

    recognition.onresult = (event) => {
        const clothingName = event.results[0][0].transcript;
        console.log('Recognized text:', clothingName);
        searchProducts(clothingName);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };
}

voiceSearch();
