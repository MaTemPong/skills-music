const jsonFetch = async (json) => {
  const response = await fetch(json);
  return response.json();
};
let json;
const contents = document.querySelector('.contents');
JsonParse();

async function JsonParse() {
  json = await jsonFetch('./music_data.json');
  console.log(json)
  let innerHTML = '';
  json.data.forEach((item, index) => {
    innerHTML += `
      <div class="col-md-2 col-sm-2 col-xs-2 product-grid">
      <div class="product-items">
              <div class="project-eff">
                  <img class="img-responsive" src="./images/${item.albumJaketImage}" alt="Time for the moon night">
              </div>
          <div class="produ-cost">
              <h5>${item.albumName}</h5>
              <span>
                  <i class="fa fa-microphone"> 아티스트</i> 
                  <p>${item.artist}</p>
              </span>
              <span>
                  <i class="fa  fa-calendar"> 발매일</i> 
                  
                  <p>${item.release}</p>
              </span>
              <span>
                  <i class="fa fa-money"> 가격</i>
                  <p>￦${item.price}</p>
              </span>
              <span class="shopbtn">
                  <button class="btn btn-default btn-xs">
                      <i class="fa fa-shopping-cart"></i> 쇼핑카트담기
                  </button>
              </span>
          </div>
      </div>
  </div>
    `
  });
  contents.innerHTML = innerHTML;
}
