const jsonFetch = async (json) => {
  const response = await fetch(json);
  return response.json();
};
let datas;
const contents = document.querySelector('.contents');
const mainMenu = document.getElementById('main-menu');
let searchInput
let searchBtn
JsonParse(); 

async function JsonParse() {
  json = await jsonFetch('./music_data.json');
  datas = Object.assign({}, json);
  //앨범
  let categorys = new Set([]);
  json.data.forEach((item, index) => {
    categorys.add(item.category);
  });  
  contents.innerHTML = renderList(json);
  categorys = [...categorys]

  //카테고리 
  mainMenu.children[mainMenu.children.length-1].remove()
  categorys.forEach((item, index) => {
    mainMenu.innerHTML += `
      <li>
        <a href="#${item}"><i class="fa fa-youtube-play fa-2x"></i> <span>${item}</span></a>
      </li>
    `
  })
  searchBtn = document.querySelector('#main-menu input~span button')
  searchInput = document.querySelector('#main-menu input')

  //Add Events
  searchBtn.addEventListener('click', ()=>{
    if(searchInput.value){
      datas.data = datas.data.filter(item => item.albumName.includes(searchInput.value))
    }
    contents.innerHTML = renderList(datas);
    datas = Object.assign({}, json);
  })
//   searchInput.addEventListener('keydown', (e)=>{
//     if(searchInput.value && e.key === 'Enter'){
//       datas.data = datas.data.filter(item => item.albumName.includes(searchInput.value))
//     }
//     contents.innerHTML = renderList(datas);
//     datas = Object.assign({}, json);
//   })

  window.addEventListener('popstate', () => {
    datas = Object.assign({}, json);
    const category = decodeURIComponent(window.location.hash).substring(1)
    if(category !== ''){
        datas.data = datas.data.filter(item => item.category === category)
    }
    contents.innerHTML = renderList(datas);
  });
}

function renderList(json){
    let innerHTML = ''
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
    })
    return innerHTML;
}