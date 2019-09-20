
let slideIndex = 0;

function homeCarousel() {
  const content = document.querySelectorAll('.content');
  const reviewTitle = document.querySelectorAll('.review-title');
  const review = document.querySelectorAll('.review');
  const reviewAuthor = document.querySelectorAll('.review-author');
  const dots = document.querySelectorAll('.dot');


  const reviewArray = [
    {
      author: '- Tom Hanks',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse condimentum neque id nunc sollicit.',
      title: 'AMAZING SERVICE!'
    },
    {
      author: '- Angelina Jolie',
      content: 'Suspendisse condimentum neque id nunc sollicitudin dictum. Etiam iaculis volutpat lectus quis viverra.',
      title: 'Best food in the world'
    },
    {
      author: '- Lily Collins',
      content: 'Etiam iaculis volutpat lectus quis viverra.',
      title: 'I really love this place'
    }
  ];

  for (let i = 0; i < reviewArray.length; i++) {
    review[i].style.display = 'none';

    content[i].innerHTML = reviewArray[i].content;
    reviewTitle[i].innerHTML = reviewArray[i].title;
    reviewAuthor[i].innerHTML = reviewArray[i].author;


  };

  slideIndex++;

  if (slideIndex > reviewArray.length) {
    slideIndex = 1;
  };

  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.
      replace(" active", "");
  }

  review[slideIndex - 1].style.display = 'block';
  dots[slideIndex - 1].className += " active";

  setTimeout(homeCarousel, 3000);


}
homeCarousel();
