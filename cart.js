$(window).load(function() {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");;
});

// get cart data from local storage
let cartData = localStorage.getItem("cart-data");

// check if cart data is not empty
if(cartData){
    LIST = JSON.parse(cartData);
    id = LIST.length;
    loadList(LIST);
}else{
    LIST = [];
    id = 0;
}

// load items function
function loadList(array){
    array.forEach(element => {
        addItemToCart(element.id, element.title, element.price, element.image, element.quantity);
    });
}

function addItemToCart(id, title, price, imageSrc, quantity){
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++){
        if (cartItemNames[i].innerText == title){
            alert('This item has already been added to the cart')
            return false
        }
    }

    var cartRowContents = `
        <div class="cart-item cart-column">
            <img src="${imageSrc}" alt="" class="cart-item-image" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input type="number" class="cart-quantity-input" id="${id}" value="${quantity}">
            <button class="btn btn-danger" id="${id}" >REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
    updateCartTotal()
    return true
}

// update total function
function updateCartTotal(){
    var cartItemContainer = document.getElementsByClassName("cart-items")[0]
    var cartRows = cartItemContainer.getElementsByClassName("cart-row")
    var total = 0
    for (var i = 0; i < cartRows.length; i++){
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$',""))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}

function quantityChanged(event){
    var input = event.target
    if (isNaN(input.value) || input.value <= 0){
        input.value = 1
    }
    index = LIST.findIndex(element => Number(element.id) === Number(input.id))

    LIST[index].quantity = input.value

    localStorage.setItem("cart-data", JSON.stringify(LIST));
    updateCartTotal()
}

// remove cart item function
function removeCartItem(event){
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    index = LIST.findIndex(element => Number(element.id) === Number(buttonClicked.id))

    LIST.splice(index, 1)

    localStorage.setItem("cart-data", JSON.stringify(LIST));
    updateCartTotal()
    
}

//purchase clicked function
document.getElementsByClassName("btn-purchase")[0].addEventListener('click', purchaseClicked)

function purchaseClicked(event){
    alert("Thank you for your purchase")
    var cartItems = document.getElementsByClassName("cart-items")[0]
    while(cartItems.hasChildNodes()){
        cartItems.removeChild(cartItems.firstChild)
    }
    localStorage.removeItem("cart-data");
    updateCartTotal()
}