/// <reference types="../@types/jquery" />

//Global Variables
let data = {};
let meal = {};

//?Events
//Side Bar
function openSidebar() {
  $(".bars-icon").addClass("hidden");
  $(".x-icon").removeClass("hidden");
  for (let i = 0; i < 5; i++) {
    $("li")
      .eq(i)
      .animate({ top: "0" }, 500 + i * 100);
  }

  $("aside").animate({ left: "0" }, 500);
}
$(".bars-icon").on("click", () => {
  openSidebar();
});
function closeSidebar() {
  $(".x-icon").addClass("hidden");
  $(".bars-icon").removeClass("hidden");
  $("li").animate({ top: "288px" }, 800);
  $("aside").animate({ left: "-256px" }, 500);
}
$(".x-icon").on("click", () => {
  closeSidebar();
});

//!Sidebar links
//?Search
$(".search").on("click", () => {
  $(".search-section").addClass("grid");
  $(".search-section").removeClass("hidden");
  closeSidebar();
  removeMeals();
});

//?Categories
$(".categories").on("click", () => {
  $("#categories").addClass("grid");
  $("#categories").removeClass("hidden");
  closeSidebar();
  removeMeals();
  getCategories();
});

//?Area
$(".area").on("click", () => {});

//?Ingredients
$(".ingredients").on("click", () => {});

//?Contact
$(".contact").on("click", () => {});

//Search
$("#nameSearch").on("input", function () {
  getMeals("s", this.value);
});
$("#letterSearch").on("input", function () {
  if (this.value != "") {
    getMeals("f", this.value);
  }
});
//Top Level
getMeals();

//!Functions
async function getMeals(searchParameter = "s", searchValue = "", endpoint = "search") {
  $(".loading").removeClass("hidden");
  $(".loading").addClass("fixed");
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/${endpoint}.php?${searchParameter}=${searchValue}`
    );

    data = await response.json();

    data = data.meals;

    removeCategories();
    displayMeals();
  } catch (error) {
    alert(error);
  } finally {
    $(".loading").addClass("hidden");
    $(".loading").removeClass("fixed");
  }
}

async function getCategories() {
  $(".loading").removeClass("hidden");
  $(".loading").addClass("fixed");
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`
    );

    data = await response.json();

    data = data.categories;

    displayCategories();
  } catch (error) {
    alert(error);
  } finally {
    $(".loading").addClass("hidden");
    $(".loading").removeClass("fixed");
  }
}

function displayCategories() {
  let cartona = "";
  for (let i = 0; i < data?.length; i++) {
    cartona += `
        <div onclick="showCategory(${data[i].idCategory})" class="group/container overflow-hidden rounded-lg cursor-pointer">
            <div class="relative">
              <img class="w-full" src="${data[i].strCategoryThumb}" alt="${data[i].strCategory}" />
            </div>
            <div
              class="inner-container group-hover/container:-top-full duration-500 h-full w-full relative top-0"
            >
              <div class="absolute inset-0 bg-neutral-300/70 flex items-center justify-start flex-col text-center gap-4">
                <h2 class="mx-3 text-black text-2xl font-semibold">${data[i].strCategory}</h2>
                <p class="text-lg line-clamp-4 text-center mx-2 text-black">${data[i].strCategoryDescription}</p>
              </div>
            </div>
          </div>
        `;
  }
  $("#categories").html(cartona);
}

function displayMeals() {
  let cartona = "";
  for (let i = 0; i < data?.length; i++) {
    cartona += `
        <div onclick="showDetails(${data[i].idMeal})" class="group/container overflow-hidden rounded-lg cursor-pointer">
          <div class="relative">
            <img class="w-full" src="${data[i].strMealThumb}" alt="${data[i].strMeal}" />
          </div>
          <div
            class="inner-container group-hover/container:-top-full duration-500 h-full w-full relative top-0"
          >
            <div class="absolute inset-0 bg-neutral-300/70 flex items-center">
              <h2 class="mx-3 text-black text-2xl font-semibold">${data[i].strMeal}</h2>
            </div>
          </div>
        </div>
        `;
  }
  $("#meals").html(cartona);
}

function removeMeals() {
  $("#meals").html("");
}

function removeCategories() {
  $("#categories").html("");
}

async function getMealDetails(id){
  try{
    const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  data = await response.json();

  data = data.meals;

  console.log(data);
}
  catch(error){
    alert(error)
  }
   meal = data;
}

 function showDetails(id) {
  //Loading Screen
  $(".loading").removeClass("hidden");
  $(".loading").addClass("fixed");

  //Save Clicked meal Data
  getMealDetails(id);
   

  //Show Details
  removeMeals();
  $("#details").removeClass("hidden");

  //Recipes
  let recipesBox = "";
  let index;
  for (const key in meal) {
    if (key.includes("strIngredient")) {
      if (meal[key] != "") {
        index = key.slice(13);
        recipesBox += `<span class="inline-block bg-blue-100 text-black p-1 m-1 rounded">${
          meal["strMeasure" + index]
        } ${meal["strIngredient" + index]}</span>`;
      }
    }
  }

  //Tags
  let tagsBox = "";
  let tags = meal["strTags"];
  if (tags != null) {
    const newTags = tags.split(",");
    newTags.forEach((tag) => {
      tagsBox += `<span class="inline-block bg-red-100 text-black p-1 m-1 rounded">${tag}</span>`;
    });
  }

  //Add to HTML
  let box = `
  <div class="image rounded-lg"><img src="${meal.strMealThumb}" class="w-full rounded-lg" alt="">
          <h2 class="title">${meal.strMeal}</h2>
          </div>
          <div class="info">
            <h2 class="title ">Information</h2>
            <p class="mb-5">${meal.strInstructions}</p>
            <h2 class="title"><b>Area</b> : ${meal.strArea}</h2>
            <h2 class="title"><b>Category</b> : ${meal.strCategory}</h2>
            <h2 class="title">Recipes :</h2>
            <div id="recipes" class="mb-3">
              ${recipesBox}
            </div>
            <h2 class="title">Tags :</h2>
            <div id="tags" class="mb-5">
              ${tagsBox}
            </div>
            <a target="_blank" href="${meal.strSource}" class="bg-green-500 hover:bg-green-600 duration-300 p-2 rounded">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="bg-red-500 hover:bg-red-600 duration-300 p-2 rounded">Youtube</a>
          </div>`;

  $("#details").html(box);
  // Remove Loading
  $(".loading").addClass("hidden");
  $(".loading").removeClass("fixed");
}

function showCategory(id) {
  //Loading Screen
  $(".loading").removeClass("hidden");
  $(".loading").addClass("fixed");

  //Save Clicked Category Data
  let category = {};
  for (const item of data) {
    if (item.idCategory == id) {
      category = item;
    }
  }
  console.log(category);
  //get meals
  getMeals("c", category.strCategory, 'filter');
}
