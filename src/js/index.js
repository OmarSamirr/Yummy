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
  removeMeals();
  $(".search-section").addClass("grid");
  $(".search-section").removeClass("hidden");
  closeSidebar();
});

//?Categories
$(".categories").on("click", () => {
  removeMeals();
  $("#categories").addClass("grid");
  $("#categories").removeClass("hidden");
  closeSidebar();
  getCategories();
});

//?Area
$(".area").on("click", () => {
  removeMeals();
  $("#area").addClass("grid");
  $("#area").removeClass("hidden");
  closeSidebar();
  getAreas();
});

//?Ingredients
$(".ingredients").on("click", () => {
  removeMeals();
  $("#ingredients").addClass("grid");
  $("#ingredients").removeClass("hidden");
  closeSidebar();
  getIngredients();
});

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
async function getMeals(
  searchParameter = "s",
  searchValue = "",
  endpoint = "search"
) {
  $(".loading").removeClass("hidden");
  $(".loading").addClass("fixed");
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/${endpoint}.php?${searchParameter}=${searchValue}`
    );

    data = await response.json();

    data = data.meals;

    removeMeals();
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
        <div onclick="getMealDetails(${data[
          i
        ].idMeal.toString()})" class="group/container overflow-hidden rounded-lg cursor-pointer">
          <div class="relative">
            <img class="w-full" src="${data[i].strMealThumb}" alt="${
      data[i].strMeal
    }" />
          </div>
          <div
            class="inner-container group-hover/container:-top-full duration-500 h-full w-full relative top-0"
          >
            <div class="absolute inset-0 bg-neutral-300/70 flex items-center">
              <h2 class="mx-3 text-black text-2xl font-semibold">${
                data[i].strMeal
              }</h2>
            </div>
          </div>
        </div>
        `;
  }
  $("#meals").html(cartona);
  $("#meals").removeClass('hidden');
}

function removeMeals() {
  $("#meals").html("");
  $("#meals").addClass('hidden');
  $("#categories").html("");
  $(".search-section").addClass("hidden");
  $("#details").html('');
  $("#area").html('');
  $("#ingredients").html('');
}

async function getMealDetails(id) {
  $(".loading").removeClass("hidden");
  $(".loading").addClass("fixed");

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    meal = await response.json();

    meal = meal.meals;

    meal = meal[0];

    removeMeals();
    showDetails();
  } catch (error) {
    alert(error);
  } finally {
    $(".loading").addClass("hidden");
    $(".loading").removeClass("fixed");
  }
}

function showDetails() {
  //Loading Screen
  $(".loading").removeClass("hidden");
  $(".loading").addClass("fixed");

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

  document.getElementById("details").innerHTML = box;

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
  //get meals
  getMeals("c", category.strCategory, "filter");
}

async function getAreas(){
  $(".loading").removeClass("hidden");
  $(".loading").addClass("fixed");

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
    );

    data = await response.json();

    data = data.meals;

    removeMeals();
    displayAreas();
  } catch (error) {
    alert(error);
  } finally {
    $(".loading").addClass("hidden");
    $(".loading").removeClass("fixed");
  }
}

function displayAreas(){
  let cartona = "";
  for (let i = 0; i < data?.length; i++) {
    cartona += `<div onclick="showArea(${i})" class="cursor-pointer">
            <div class="relative text-center">
              <i class="fa-solid fa-house-laptop fa-4x"></i>
              <h3 class="text-3xl font-semibold">${data[i].strArea}</h3>
            </div>
          </div>`;
  }
  $("#area").html(cartona);
  $("#area").html(cartona);

}

function showArea(id){
  //Loading Screen
  $(".loading").removeClass("hidden");
  $(".loading").addClass("fixed");

  //get meals
  getMeals("a", data[id].strArea, "filter");
  
}

async function getIngredients(){
  $(".loading").removeClass("hidden");
  $(".loading").addClass("fixed");

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
    );

    data = await response.json();

    data = data.meals;

    removeMeals();
    displayIngredients();
  } catch (error) {
    alert(error);
  } finally {
    $(".loading").addClass("hidden");
    $(".loading").removeClass("fixed");
  }
}

function displayIngredients(){
  let cartona = "";
  for (let i = 0; i < 20; i++) {
    cartona += `<div onclick="showIngredients(${i})" class="cursor-pointer">
            <div class="relative text-center">
              <i class="fa-solid fa-drumstick-bite fa-4x"></i>
              <h3 class="text-3xl font-semibold">${data[i].strIngredient}</h3>
              <p class="text-center line-clamp-3">${data[i].strDescription}</p>
            </div>
          </div>`;
  }
  $("#ingredients").html(cartona);
  $("#ingredients").html(cartona);

}

function showIngredients(id){
  //Loading Screen
  $(".loading").removeClass("hidden");
  $(".loading").addClass("fixed");

  //get meals
  getMeals("i", data[id].strIngredient, "filter");
  
}