$(window).load(function() {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");;
});


// Event listeners
var removeCartItemButtons = document.getElementsByClassName("btn-danger");
for (var i = 0; i < removeCartItemButtons.length; i++){
    var button = removeCartItemButtons[i]
    button.addEventListener('click', removeCartItem)
}

var quantityInputs = document.getElementsByClassName('cart-quantity-input')
for (var i = 0; i < quantityInputs.length; i++){
    var button = quantityInputs[i]
    button.addEventListener('change', quantityChanged)
}

var addToCartButtons = document.getElementsByClassName("shop-item-button");
for (var i = 0; i < addToCartButtons.length; i++){
    var button = addToCartButtons[i]
    button.addEventListener('click', addToCartClicked)
}

// Cart item count on sticky icon
function increaseCartIcon(){
    var cartIcon = document.getElementById("item-number");
    cartIcon.innerHTML = LIST.length;
}

// Modal popup function
var modal = document.getElementById("Modal")
var continueShopping = document.getElementById("continue-sh")

function PopupModal(){
    modal.style.display = "flex";
}
// close modal
continueShopping.onclick = function(){
    modal.style.display = "none";
}

window.onclick = function(event){
    if (event.target == modal){
        modal.style.display = "none";
    }
}


// get cart data from local storage
let LIST, id;
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



//purchase clicked function
document.getElementsByClassName("btn-purchase")[0].addEventListener('click', purchaseClicked)

function purchaseClicked(event){
    alert("Thank you for your purchase")
    var cartItems = document.getElementsByClassName("cart-items")[0]
    while(cartItems.hasChildNodes()){
        cartItems.removeChild(cartItems.firstChild)
    }
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
    increaseCartIcon()  
}

// quantity change function
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

// add to cart clicked event function
function addToCartClicked(event){
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    
    var quantity = 1

    if(addItemToCart(id, title, price, imageSrc, quantity)){
        LIST.push({
            id : id,
            image : imageSrc,
            title : title,
            price : price,
            quantity : quantity
        })

        id++
    
        localStorage.setItem("cart-data", JSON.stringify(LIST));
        updateCartTotal()
        increaseCartIcon()
        PopupModal()
    }
}

// Add item to cart function
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
    increaseCartIcon()
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