const jsonFetch = async (json) => {
  const response = await fetch(json);
  return response.json();
};


let datas;
const contents = document.querySelector('.contents');
const mainMenu = document.getElementById('main-menu');

JsonParse(); 

async function JsonParse() {
  json = await jsonFetch('./music_data.json');
  json.data = json.data.sort((a, b)=> {
    return b.release.split('.').join("") - a.release.split('.').join("")
  })
  
  let productIncluded = await localStorage.getItem('productIncluded')
  if(!productIncluded){
    localStorage.setItem('productIncluded', JSON.stringify([]));
  }
  productIncluded = JSON.parse(productIncluded)
  
  
  //앨범
  let categorys = new Set([]);
  json.data.forEach((item, index) => {
    categorys.add(item.category);
  });  
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
  
  const searchBtn = document.querySelector('#main-menu input~span button')
  const searchInput = document.querySelector('#main-menu input')
  const openBuyModalBtn = document.querySelector('.panel-body button')
  const buyModal = document.querySelector('.modal-body')
  const containList = buyModal.querySelector('tbody')
  let containItem = containList.querySelectorAll('tr')

  datas = Object.assign({}, json);
  render();
  init();

  
  //Add Events
  
  searchBtn.addEventListener('click', ()=>{
    if(searchInput.value){
      datas.data = datas.data.filter(item => item.albumName.includes(searchInput.value))
    }
    render();
    datas = Object.assign({}, json);
  })
  
  searchInput.addEventListener('keydown', (e)=>{
    if(searchInput.value && e.key === 'Enter'){
      datas.data = datas.data.filter(item => item.albumName.includes(searchInput.value) || item.artist.includes(searchInput.value))
      console.log(datas.data)
      if(datas.data.length === 0){
        datas = Object.assign({}, json);
        return contents.innerHTML = `
          <h2>검색된 앨범이 없습니다.</h2>
        `
      }
      render();
      datas = Object.assign({}, json);
    } else if(!searchInput.value && e.key === 'Enter'){
      render();
    } 
  })

  window.addEventListener('popstate', () => {
    datas = Object.assign({}, json);
    const category = decodeURIComponent(window.location.hash).substring(1)
    mainMenu.querySelectorAll('li').forEach((item) => {
      console.log(category)
      if(item.querySelector('span').textContent === category){
        item.classList.add('active-menu')
      } else{
        item.classList.remove('active-menu')
      }
    })
    if(category !== ''){
        datas.data = datas.data.filter(item => item.category === category)
    }
    render();
  });

  const totalBuyBtn = document.querySelector('.modal-footer').lastElementChild;
    totalBuyBtn.setAttribute('data-dismiss', 'modal')
    totalBuyBtn.addEventListener('click', ()=> {
      alert('구매가 완료되었습니다.')
      console.log("dksfsdgjlkhkj")
      localStorage.setItem('productIncluded', JSON.stringify([]))
      init();
  })

  function render(){
    let innerHTML = ''
    datas.data.forEach((item, index) => {
        albumName = item.albumName.replace(searchInput.value, `<strong style = "background-color: yellowgreen">${searchInput.value}</strong>`)
        artist = item.artist.replace(searchInput.value, `<strong style = "background-color: yellowgreen">${searchInput.value}</strong>`)
        innerHTML += `
        <div class="col-md-2 col-sm-2 col-xs-2 product-grid">
          <div class="product-items">
                  <div class="project-eff">
                      <img class="img-responsive" src="./images/${item.albumJaketImage}" alt="Time for the moon night">
                  </div>
              <div class="produ-cost">
                  <h5>${albumName}</h5>
                  <span>
                      <i class="fa fa-microphone"> 아티스트</i> 
                      <p>${artist}</p>
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
    contents.innerHTML = innerHTML;

    const productItem = document.querySelectorAll('.product-items');
    productItem.forEach((item, index) => {
      const buyBtn = item.querySelector('button')
      buyBtn.addEventListener('click', async () => {

        const albumJaketImage = item.querySelector('img').getAttribute('src');

        const cost = item.querySelector('.produ-cost');

        const albumName = cost.querySelector('h5').textContent;
        const artist = cost.children[1].lastElementChild.textContent;
        const release = cost.children[2].lastElementChild.textContent;
        const price = cost.children[3].lastElementChild.textContent.replace(/원/g, '').substring(1);

        productIncluded = JSON.parse(localStorage.getItem('productIncluded'))
        
        const targetProduct = {
          albumJaketImage   : albumJaketImage,
          albumName         : albumName,
          artist            : artist,
          release           : release,
          price             : price,
          cnt               : 1
        }
        let targetPos = -1;
        const isIncluded = productIncluded.some((obj, idx) => {
          targetPos++;
          return obj.albumName === targetProduct.albumName && obj.artist === targetProduct.artist
        });
        if(isIncluded){
          productIncluded[targetPos].cnt += 1;
        } else {
          productIncluded = [...productIncluded, targetProduct]
        }
        localStorage.setItem('productIncluded', JSON.stringify(productIncluded))

        init();
      })
    })
  }
  
  function init(){
    productIncluded = JSON.parse(localStorage.getItem('productIncluded'))
    let cnt = 0;
    let totalPrice = 0;
    if(productIncluded.length !== 0){
      productIncluded.forEach((item, index)=> {
        cnt += +item.cnt;
        totalPrice += +item.cnt * +item.price
      })
    }
    openBuyModalBtn.innerHTML = `
      <i class="fa fa-shopping-cart"></i> 쇼핑카트 <strong>${cnt}</strong> 개 금액 ￦ ${totalPrice}원</a> 
    `
    let innerHTML = ''
    productIncluded.forEach((item, index) => {
      innerHTML += `
      <tr>
        <td class="albuminfo">
            <img src="${item.albumJaketImage}">
            <div class="info">
                <h4>${item.albumName}</h4>
                <span>
                    <i class="fa fa-microphone"> 아티스트</i> 
                    <p>${item.artist}</p>
                </span>
                <span>
                    <i class="fa  fa-calendar"> 발매일</i> 
                    <p>${item.release}</p>
                </span>
            </div>
        </td>
        <td class="albumprice">
            ￦ ${item.price}
        </td>
        <td class="albumqty">
            <input type="number" class="form-control" value=${item.cnt}>
        </td>
        <td class="pricesum">
            ￦ ${item.cnt * item.price}
        </td>
        <td>
            <button class="btn btn-default">
                <i class="fa fa-trash-o"></i> 삭제
            </button>
        </td>
      </tr>
    `
    })
    containList.innerHTML = innerHTML;
    containItem = containList.querySelectorAll('tr')

    const totalPriceView = buyModal.querySelector('h3>span')
    totalPriceView.textContent = totalPrice;
  

    containItem.forEach((item, index) => {
      const cntInput = item.querySelector('input')
      const albumName = item.querySelector('h4').textContent
      const artist = item.querySelector('.info').children[1].lastElementChild.textContent
      const deleteItem = item.querySelector('button')


      console.log(cntInput.value)
      cntInput.addEventListener('change', ()=> {
        if(+cntInput.value < 1){
          cntInput.value = 1;
          return;
        }
        productIncluded.some((obj, idx) => {
          if(obj.albumName === albumName && obj.artist === artist){
            obj.cnt = +cntInput.value;
            console.log(obj.cnt)
            localStorage.setItem('productIncluded', JSON.stringify(productIncluded))
            init();
            return;
          }
        });
      })

      deleteItem.addEventListener('click', ()=> {
        if(!confirm("정말로 삭제하시겠습니까?")) return;
        productIncluded = productIncluded.filter(obj => obj.albumName !== albumName || obj.artist !== artist)
        localStorage.setItem('productIncluded', JSON.stringify(productIncluded))
        init();
      })
    })
  }
}