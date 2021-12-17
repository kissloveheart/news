//-----------DOM Selector----------

const articleBlock = document.querySelector(".topTrend");
const btnSearch = document.querySelector(".navRight");
const modal = document.querySelector(".modal");
const btnClose = document.querySelector(".close");
const btnSearchModal = document.querySelector("#btnSearchModal");
const inputQuery = document.querySelector("#query");
const articleFrom = document.querySelector("#from");
const articleTo = document.querySelector("#to");
const loadData = document.querySelector(".loading");

//--------Get data from Gnews----
const getData = function (query = "top-headlines?") {
  ////-------loading------------
  loadData.insertAdjacentHTML("beforeend", `<div class="lds-dual-ring"></div>`);
  ///----- get data ----------
  fetch(
    `https://gnews.io/api/v4/${query}&lang=en&max=10&token=74dd729d82c74bc238dc3ccd93247a33`
  )
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Can not read data from Gnews");
      }
    })
    .then(function (data) {
      articleBlock.innerHTML = "";
      data.articles.forEach(function (article, index) {
        ///--------set varible-----------
        const title = article.title;
        const urlImage = article.image;
        const urlArticle = article.url;
        const content = article.content.slice(0, -12);
        const date = new Date(article.publishedAt);
        const time = date.toLocaleTimeString();
        const year = date.toDateString();
        const author = article.source.name;

        ///--------Show article----------

        articleBlock.insertAdjacentHTML(
          "beforeend",
          ` <div class="cover${index % 2 == 0 ? 0 : 1}">
            <div class="title"><a href="${urlArticle}" target="_black"><h2>${title}</h2></a></div>
            <div class="content">
              <div class="imageArticle">
                <img src="${urlImage}" alt="${title}" class="imageSize"/>
             </div>
            <div class="detailArticle">
              <p>By <strong>${author}</strong></p> 
              <p class="time">${time} ${year}</p>  
              <p class="contentText">${content} <a href="${urlArticle}" target="_black">[continue]</a></p>          
            </div>
          </div>
        </div>`
        );
      });
    })
    .then(function () {
      loadData.innerHTML = "";
    })
    .catch(function (error) {
      loadData.insertAdjacentHTML("beforeend", `<h4>${error}</h4>`);
    });
};

/// -----Show the modal----------
const showModal = function () {
  modal.classList.remove("hidden");
};
///----- Hidden the modal----------
const closeModal = function () {
  modal.classList.add("hidden");
};

///------Run modal------------
btnSearch.addEventListener("click", showModal);
btnClose.addEventListener("click", closeModal);
document.addEventListener("click", (e) =>
  e.target == modal ? closeModal() : ""
);
document.addEventListener("keydown", (e) => {
  e.key == "Escape" && !modal.classList.contains("hidden") ? closeModal() : "";
});

////------Search--------------
const searchKeywork = function () {
  //----set varible
  let query = "";
  const keywork = inputQuery.value;
  console.log(articleFrom.value, articleTo.value);
  const timeFrom =
    articleFrom.value != ""
      ? new Date(articleFrom.value).toISOString().replace(".000", "")
      : "";
  const timeTo =
    articleTo.value != ""
      ? new Date(articleTo.value).toISOString().replace(".000", "")
      : "";
  console.log(timeFrom);
  console.log(timeTo);
  inputQuery.value = "";
  if (keywork != "") {
    query = "search?q=" + keywork + "&from=" + timeFrom + "&to=" + timeTo;

    //----turn off modal
    closeModal();
    //----get data from keywork
    console.log(query);
    getData(query);
  } else {
    alert("Hãy nhập keywork");
  }
};

btnSearchModal.addEventListener("click", function (e) {
  e.preventDefault();
  searchKeywork();
});
document.addEventListener("keydown", function (e) {
  if (e.key == "Enter" && !modal.classList.contains("hidden")) {
    e.preventDefault();
    searchKeywork();
  }
});

///------run code------
getData();
