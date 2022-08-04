let modalQt = 1;
let cart = [];
let modalKey = 0

const d = (element) => document.querySelector(element);
const ds = (element) => document.querySelectorAll(element);

function changeImage(e) {
    const smallImg = e.src;
    d('.tenisBig img').src = smallImg;
}


//LISTAGEM DOS TÊNIS
tenisJson.map((item, index) => {
    let tenisItem = d('.models .tenis-item').cloneNode(true);

    tenisItem.setAttribute('data-key', index);
    tenisItem.querySelector('.tenis-item--img img').src = item.images[0]
    tenisItem.querySelector('.tenis-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    tenisItem.querySelector('.tenis-item--name').innerHTML = item.name;
    tenisItem.querySelector('.tenis-item--desc').innerHTML = item.description;
    tenisItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.tenis-item').getAttribute('data-key');
        let cont = 0;
        modalQt = 1;
        modalKey = key;

        d('.tenisBig img').src = tenisJson[key].images[0];
        ds('.preview-img').forEach((element) => {
            element.src = tenisJson[key].images[cont];
            element.addEventListener('click', (e) => changeImage(e.target));
            cont++;
        })
        // d('.tenisSmall--1').src = tenisJson[key].img2;
        // d('.tenisSmall--1').addEventListener('click', (e) => changeImage(e.target));
        // d('.tenisSmall--2').src = tenisJson[key].img3;
        // d('.tenisSmall--2').addEventListener('click', (e) => changeImage(e.target));
        // d('.tenisSmall--3').src = tenisJson[key].img4;
        // d('.tenisSmall--3').addEventListener('click', (e) => changeImage(e.target));
        d('.tenisInfo h1').innerHTML = tenisJson[key].name;
        d('.tenisInfo--desc').innerHTML = tenisJson[key].description;
        d('.tenisInfo--actualPrice').innerHTML = `R$ ${tenisJson[key].price.toFixed(2)}`;
        d('.tenisInfo--size.selected').classList.remove('selected');
        ds('.tenisInfo--size-wrapper').forEach((size, sizeIndex) => {
            if(sizeIndex == 2) {
                size.querySelector('.tenisInfo--size').classList.add('selected');
            }

            size.querySelector('.tenisInfo--size').innerHTML = tenisJson[key].sizes[sizeIndex];
        })

        d('.tenisInfo--qt').innerHTML = modalQt;

        d('.tenisWindowArea').style.opacity = 0;
        d('.tenisWindowArea').style.display = 'flex';
        setTimeout(() => {
            d('.tenisWindowArea').style.opacity = 1;
        }, 50);
    })

    d('.tenis-area').append(tenisItem);
});

//EVENTOS DO MODAL
function closeModal() {
    d('.tenisWindowArea').style.opacity = 0;
    setTimeout(() => {
        d('.tenisWindowArea').style.display = 'none';
    }, 500);
}
ds('.tenisInfo--cancelButton, .tenisInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
})
d('.tenisInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        d('.tenisInfo--qt').innerHTML = modalQt;
    }
});
d('.tenisInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    d('.tenisInfo--qt').innerHTML = modalQt;
});
ds('.tenisInfo--size-wrapper').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        d('.tenisInfo--size.selected').classList.remove('selected');
        e.target.classList.add('selected');
    })
});
d('.tenisInfo--addButton').addEventListener('click', () => {
    let size = parseInt(d('.tenisInfo--size-wrapper .tenisInfo--size.selected').getAttribute('data-key'));
    let identifier = tenisJson[modalKey].id+'@'+size;
    let checkKey = cart.findIndex((item) => item.identifier == identifier);

    if (checkKey > -1) {
        cart[checkKey].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:tenisJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();
});

d('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        d('aside').style.left = '0';
    }
})
d('.menu-closer').addEventListener('click', () => {
    d('aside').style.left = '100vw';
})

function updateCart() {
    d('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        d('aside').classList.add('show');
        d('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let tenisItem = tenisJson.find((item) => item.id == cart[i].id)
            subtotal += tenisItem.price * cart[i].qt;  

            let cartItem = d('.models .cart--item').cloneNode(true);
            let tenisSizeName;
            switch(cart[i].size) {
                case 0:
                    tenisSizeName = tenisItem.sizes[0];
                    break
                case 1:
                    tenisSizeName = tenisItem.sizes[1];
                    break;
                case 2:
                    tenisSizeName = tenisItem.sizes[2];
                    break;
                case 3:
                    tenisSizeName = tenisItem.sizes[3];
                    break;
                case 4:
                    tenisSizeName = tenisItem.sizes[4];
                    break;
            }
            
            let tenisName = `${tenisItem.name} (${tenisSizeName})`;
            
            cartItem.querySelector('img').src = tenisItem.images[0];
            cartItem.querySelector('.cart--item-nome').innerHTML = tenisName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1); 
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            d('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        d('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        d('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        d('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        d('aside').classList.remove('show');
        d('aside').style.left = '100vw';
    }
}