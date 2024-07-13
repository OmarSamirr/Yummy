/// <reference types="../@types/jquery" />

//Global Variables
let data = {};

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

//Sidebar links
$(".search").on("click", () => {
  $(".search-section").addClass("grid");
  $(".search-section").removeClass("hidden");
  closeSidebar();
  removeMeals();
});
$(".categories").on("click", () => {});
$(".area").on("click", () => {});
$(".ingredients").on("click", () => {});
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
async function getMeals(searchParameter = "s", searchValue = "") {
  $(".loading").removeClass("hidden");
  $(".loading").addClass("fixed");
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?${searchParameter}=${searchValue}`
    );

    data = await response.json();

    data = data.meals;

    displayMeals();
  } catch (error) {
    alert(error);
  } finally {
    $(".loading").addClass("hidden");
    $(".loading").removeClass("fixed");
  }
}

function displayMeals() {
  let cartona = "";
  for (let i = 0; i < data?.length; i++) {
    cartona += `
        <div div class="group/container overflow-hidden rounded-lg">
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
