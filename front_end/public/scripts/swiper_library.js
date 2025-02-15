
function formatData(wrongFormatArticleData) {

    let title;
    let paragraphs = [];
    let urlImage;

    wrongFormatArticleData.articleData.blocks.forEach(block => {
        if (block.type === 'header') {
            title = block.data.text
            return
        }

        if (block.type === 'image') {
            urlImage = block.data.file.url
            return
        }

        paragraphs.push(block.data.text)

    });

    articleData = {
        'title': title,
        'paragraphs': paragraphs,
        'urlImage': urlImage
    }

    return articleData
}


const swiperWrapper = document.querySelector('.swiper-wrapper');

(async () => {
    const response = await fetch(`${localhost}/getLatestUserArticles`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });
    
    const articlesObjectList = await response.json();

    if (articlesObjectList.length > 0) {

        articlesObjectList.forEach(wrongFormatArticleData => {

            const articleData = formatData(wrongFormatArticleData);

            const swiperSlideDiv = document.createElement('div');
            swiperSlideDiv.className = 'swiper-slide';

            swiperSlideDiv.onclick = () => {
                localStorage.removeItem('articleUrl');
                localStorage.setItem('fullArticleData', JSON.stringify(articleData));
                localStorage.setItem('pageId', JSON.stringify(wrongFormatArticleData.pageId));
                window.location.href = `/user/read_article`
            };

            const slideTitle = document.createElement('h3');
            slideTitle.className = 'text-xl text-center';
            slideTitle.textContent = articleData.title;
            swiperSlideDiv.appendChild(slideTitle);

            const slideImg = document.createElement('img');
            slideImg.src = articleData.urlImage;
            swiperSlideDiv.appendChild(slideImg);

            swiperWrapper.appendChild(swiperSlideDiv);
            
        });

        const swiper = new Swiper(".mySwiper", {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",
            coverflowEffect: {
                rotate: 40,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            },
            pagination: {
                el: ".swiper-pagination",
            },
            loop: articlesObjectList.length >= 7 ? true : false,
        });

        return
    }

    const div = document.querySelector('#main-container');
    div.classList.add('flex', 'flex-col', 'justify-center', 'items-center', 'mt-6', 'gap-8');

    const h1 = document.createElement('h1');
    h1.className = 'text-3xl font-bold';
    h1.textContent = "Your library is empty.";
    div.appendChild(h1);

    const p = document.createElement('p');
    p.className = 'text-2xl font-semibold';
    p.textContent = "Search for an article and save it, then come here to read it.";
    div.appendChild(p);

    document.querySelector('#latestArticlesH1').className = 'hidden';
    document.querySelector('.swiper').className = 'hidden';
    document.querySelector('#AtoZArticlesH1').className = 'hidden';
    document.querySelector('#paginationButtons').className = 'hidden';

})();