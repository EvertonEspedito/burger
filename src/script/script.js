//IDs
const menu = document.getElementById("menu");
const modal = document.getElementById("modal");
const cartItens = document.getElementById("cart-itens");
const totalCart = document.getElementById("card-total");
const adress = document.getElementById("adress");
const adressWarn = document.getElementById("adress-warn")
const closeModal = document.getElementById("close-modal-btn")
const checkOut = document.getElementById("checkout-btn")
const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-counter");
const aberto = document.getElementById("data-span");

let cart=[];

//Eventos

    //Abrir Modal
cartBtn.addEventListener("click",()=>{
    updateCartModal();
    modal.style.display="flex"
});
    //Fechar Modal ao Clicar Fora
modal.addEventListener("click",()=>{
    if(event.target === modal){
        modal.style.display="none"
    }
});
    //Fechar Modal
closeModal.addEventListener("click",()=>{
    modal.style.display="none"
});
    //Adicionar ao Cart
menu.addEventListener("click",(event)=>{
    let parentButton = event.target.closest(".add-to-cart");
    //Pegando data price e name
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    //Adicionar no carrinho
    addToCart(name,price)
})    
   
//Funçôes

    //Função Adicionar no Carrinho
function addToCart(name, price) { 
    //Conferindo se tem um item igual
    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {
        existingItem.quantity+=1;
     
    }else{
        cart.push({
            name,
            price,
            quantity:1
        })
    }

    updateCartModal();
}

    //Atualiza o Carrinho
function updateCartModal () { 
    cartItens.innerHTML = "";
    let total = 0;

    cart.forEach(item=>{
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex","justify-between","mb-4","flex-col");
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p  class="font-medium">${item.name}</p>
                    <p>QTD: ${item.quantity}</p>
                    <p class="mt-2 font-medium">R$ ${item.price.toFixed(2)}</p>
                </div>

                <div>
                    <button class="remove-cart-btn" data-name="${item.name}">Remover</button>
                </div>
            </div>
        `

        total += item.price*item.quantity;
        cartItens.appendChild(cartItemElement); 
    })

    totalCart.textContent=total.toLocaleString("pt-BR", {
        style:"currency",
        currency:"BRL",
        
    })
    cartCount.innerHTML = cart.length;
}    

    //Função para Remover Item do Carrinho
cartItens.addEventListener("click",(event)=>{
    if (event.target.classList.contains("remove-cart-btn")) {
        const name = event.target.getAttribute("data-name");

        removeItemcart(name);
    }
    
})  

function removeItemcart (name) { 
    const index = cart.findIndex(item => item.name === name);

    if (index != -1) {
        const item = cart[index];

        if (item.quantity > 1 ) {
            item.quantity -= 1;
          
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}

    //Função de endereço
adress.addEventListener("input",(event)=>{
    let inputValue = event.target.value
    if (inputValue !== "") {
        adressWarn.classList.add("hidden");
        adress.classList.remove("border-red-500");
    }
})

    //Função de fechar carrinho
checkOut.addEventListener("click",()=>{
    const isOpen = checkRest();
    if (!isOpen){
        Toastify({
            text: "Ops, Estamos fechados no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(190,23,23,1) 0%, rgba(252,176,69,1) 100%)",
              color: "#fff",
              fontSize: "16px",

            },
            onClick: function(){} // Callback after click
        }).showToast();
    }


    if (cart.length === 0 ) return;
    if (adress.value === "") {
        adressWarn.classList.remove("hidden");
        adress.classList.add("border-red-500");
        return;
    }
     //Enviar pelo whatzaap

     const cartItens = cart.map((item)=>{
        return (`-*${item.name}*\n - *Quantidade:${item.quantity}*\n- *Preço:R$${item.price}*\n\n`);
    }).join("")

    const menssage = encodeURIComponent(cartItens);
    const phone = "5587999292036";
    window.open(`https://wa.me/${phone}?text=${menssage} \n Endereço: *${adress.value}* | *Total:${totalCart.innerText}*`);
    cart=[];
    updateCartModal();
})

    //Verificar se o estabelecimento esta aberto ou fechado
function checkRest() {  
    const data = new Date();    
    const hora = data.getHours();
    return hora >= 18 && hora < 23; 
}    

const isOpen = checkRest();
if (isOpen) {
    aberto.classList.remove("bg-red-500");
    aberto.classList.add("bg-green-600");
}else{
    aberto.classList.remove("bg-green-600");
    aberto.classList.add("bg-red-500");
}