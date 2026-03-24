/* -----------------------------*/
// HIGHLIGHT AN ACTIVE PAGE
/* -----------------------------*/
function highlightActivePage(){
    const currentPage = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll(".nav-link");
    links.forEach(link => {
        const linkPage = link.getAttribute("href");
        if(linkPage === currentPage){
            link.classList.add("active");
        }
    });
}
/* -----------------------------*/
// DOM MENU DATA
/* -----------------------------*/
const MENU_ITEMS = [
    {id:1, name:"Pancake Stack", description:"Fluffy pancakes with maple syrup", price:8.99, category:"Breakfast",image:"./images/fluffy-pancakes.jpg"},
    {id:2, name:"Steak & Eggs", description:"Grilled steak with eggs and toast", price:14.99, category:"Breakfast",image:"./images/grilled-steak-egg-n-toast.jpg"},
    {id:3, name:"French Toast", description:"Classic cinnamon french toast", price:9.99, category:"Breakfast",image:"./images/Cinnamon-French-Toast.jpg"},
    {id:4, name:"Breakfast Burrito", description:"Burrito with scrambled eggs, sausage, and hash rounds", price:7.99, category:"Breakfast",image:"./images/Breakfast-Burritos.jpg"},
    {id:5, name:"Caesar Salad", description:"Romaine lettuce, parmesan, croutons", price:10.99, category:"Lunch",image:"./images/caesar-salad61.jpg"},
    {id:6, name:"Steakhouse Wings", description:"Grilled wings with smoky BBQ glaze", price:12.99, category:"Lunch",image:"./images/steakhouse-wings.jpg"},
    {id:7, name:"Loaded Tater Skins", description:"Baked potato halves with bacon and cheese", price:11.99, category:"Lunch",image:"./images/loaded-potato-skins.jpg"},
    {id:8, name:"Half-Pound Cheeseburger", description:"Classic burger, grilled to order", price:14.99, category:"Lunch",image:"./images/Half-pound-cheeseburger.jpg"},
    {id:9, name:"12oz Ribeye", description:"Prime ribeye grilled over open flame", price:34.99, category:"Dinner",image:"./images/12oz-ribeye.jpg"},
    {id:10, name:"Filet Mignon", description:"Center cut filet with herb butter and fries", price:39.99, category:"Dinner",image:"./images/filet_mignon_steak.jpg"},
    {id:11, name:"Ribeye Pasta", description:"Cajun Steak Linguine with Creamy Parmesan sauce", price:29.99, category:"Dinner",image:"./images/signature_rib-eye-with-linguine.jpg"},
    {id:12, name:"French Onion Soup", description:"Beef broth, caramelized onions", price:9.99, category:"Dinner",image:"./images/french-onion-soup.jpg"},
    {id:13, name:"Tomato Basil Soup", description:"Velvety tomato puree with cream and spices", price:7.99, category:"Dinner",image:"./images/Tomato-basil-soup.jpg"},
    {id:14, name:"Chocolate Cake", description:"Warm molten chocolate lava dessert", price:9.99, category:"Dinner",image:"./images/chocolate-cake.jpg"},
    {id:15, name:"Chantilly Berry Parfait", description:"Mixed Berry Parfait with Chantilly Cream", price:6.99, category:"Dinner",image:"./images/chantilly-berry-parfait.jpg"},
    {id:16, name:"House Cabernet", description:"Premium cabernet sauvignon", price:12.99, category:"Dinner",image:"./images/premium-cabernet-sauvignon.jpg"},
    {id:17, name:"Old Fashioned", description:"Bourbon, bitters, orange peel", price:11.99, category:"Dinner",image:"./images/old-fashioned3.jpg"},
    {id:18, name:"Mediterranean Mint Cocktail", description:"Curated mint cocktail with seasonal ingredients", price:9.99, category:"Dinner",image:"./images/Mediterranean-mint-cocktail.jpg"}

];
/* -----------------------------*/
// DOM MENU RENDERING
/* -----------------------------*/
/* -----------------------------*/
// RENDER MENU FUNCTION
/* -----------------------------*/
let currentCategory = "All";
let searchQuery = "";

function renderMenu() {

    const container = document.getElementById("menu-container");
    if (!container) return;
    container.innerHTML = "";
    // FORMAT PRICES
    const money = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });

    let filtered = MENU_ITEMS.filter(item => {
        const matchesCategory =
            currentCategory === "All" || item.category === currentCategory;
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery) ||
            item.description.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4 fade-in";
        // card.className = "col mt-4";
        card.innerHTML = `
            <div class="card h-100">
                ${item.image ? `
                    <div class="card-img-wrapper">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                ` : ""}
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${item.description}</p>
                    <p class="fw-bold">${money.format(item.price)}</p>
                    <span class="badge bg-dark">${item.category}</span>
                    
                    <div class="mt-2">
                        <select class="form-select quantity" data-id="${item.id}">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                        </select>
                    </div>
                    
                    <button class="btn btn-warning mt-2 add-to-cart" data-id="${item.id}">
                        Add to Cart
                    </button>
                    
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}
/*----------------------------------------*/
//ADDING CART LOGIC TO CART QUANTITIES
/*----------------------------------------*/
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function enableAddToCart(){
    document.addEventListener("click", function(e){
        if(e.target.classList.contains("add-to-cart")){
            const btn = e.target;

            // DISABLE BUTTON TEMPORARILY
            btn.disabled = true;
            btn.textContent = "Adding...";

            const id = parseInt(btn.dataset.id);
            const qtySelect = document.querySelector(`.quantity[data-id="${id}"]`);
            const quantity = parseInt(qtySelect.value);

            const item = MENU_ITEMS.find(i => i.id === id);
            const existing = cart.find(i => i.id === id);

            if(existing){
                existing.quantity += quantity;
            } else {
                cart.push({...item, quantity});
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            animateToCart(btn);
            updateCartBadge();
            showToast();

            // RESTORE BUTTON
            setTimeout(()=>{
                btn.disabled = false;
                btn.textContent = "Add to Cart";
            }, 1000);
        }
    });
}
/*------------------------------------*/
//IMPLEMENTING CART LOGIC FOR CART HTML
/*-----------------------------------*/
function renderCart(){
    const container = document.getElementById("cart-container");
    if(!container) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if(cart.length === 0){
        container.innerHTML = `
            <div class="text-center mt-5">
                <h4>Your Cart is empty!</h4>
<!--                <a href="menu.html" class="btn btn-warning mt-3">Browse Menu</a>-->
            </div>
        `;
        return;
    }

    let subtotal = 0;

    let html = `
        <table class="table table-dark table-striped">
            <thead class="thead-class">
                <tr>
                    <th>Menu Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
    `;

    cart.forEach(item => {
        const lineTotal = item.price * item.quantity;
        subtotal += lineTotal;

        html += `
            <tr>
                <td class="d-flex align-items-center gap-2">
                    <img src="${item.image}" width="50" height="50" style="object-fit:cover; border-radius:6px;">
                    ${item.name}
                </td>
                <td>${item.quantity}</td>
                <td>$${lineTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    const tax = subtotal * 0.0825;
    const total = subtotal + tax;

    html += `
        <div class="mt-4 text-end">
            <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
            <p><strong>Tax (8.25%):</strong> $${tax.toFixed(2)}</p>
            <h4><strong>Total:</strong> $${total.toFixed(2)}</h4>
        </div>
    `;

    container.innerHTML = html;
}
/*------------------------------------*/
//CANCEL & SUBMIT LOGIC FOR CART HTML
/*-----------------------------------*/
function enableCartButtons(){
    const cancelBtn = document.getElementById("cancel-order");
    const submitBtn = document.getElementById("submit-order");

    if(cancelBtn){
        cancelBtn.addEventListener("click", ()=>{
            const modal = new bootstrap.Modal(document.getElementById("cancelModal"));
            modal.show();
        });
    }

    const confirmCancel = document.getElementById("confirmCancel");
    if(confirmCancel){
        confirmCancel.addEventListener("click", ()=>{
            localStorage.removeItem("cart");

            const modal = new bootstrap.Modal(document.getElementById("CanceledModal"));
            modal.show();

            setTimeout(()=>{
                window.location.href = "menu.html";
            }, 1000);
        });
    }

    if(submitBtn){
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        submitBtn.addEventListener("click", ()=>{
            localStorage.removeItem("cart");

            if(cart.length === 0) {
                const modal = new bootstrap.Modal(document.getElementById("No-thankYouModal"));
                modal.show();
            }else{
                const modal = new bootstrap.Modal(document.getElementById("thankYouModal"));
                modal.show();
            }

            setTimeout(()=> window.location.href = "menu.html", 1500);
        });
    }
}
/*-------------------*/
//UPDATING CART BADGE
/*-------------------*/
function updateCartBadge(){
    const badge = document.getElementById("cart-count");
    if(!badge) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const totalItems = cart.reduce((sum, item)=> sum + item.quantity, 0);

    badge.textContent = totalItems;
}
/*-----------------------------*/
//ANIMATE-TO-CART FUNCTIONALITY
/*----------------------------*/
function animateToCart(button){
    const cartIcon = document.querySelector("#cart-count");
    if(!cartIcon) return;

    const img = button.closest(".card").querySelector("img");
    if(!img) return;

    const imgClone = img.cloneNode(true);

    const rect = img.getBoundingClientRect();
    imgClone.style.width = "80px";
    imgClone.style.height = "80px";
    imgClone.style.left = rect.left + "px";
    imgClone.style.top = rect.top + "px";

    imgClone.classList.add("fly");
    document.body.appendChild(imgClone);

    const cartRect = cartIcon.getBoundingClientRect();

    setTimeout(()=>{
        imgClone.style.left = cartRect.left + "px";
        imgClone.style.top = cartRect.top + "px";
        imgClone.style.width = "20px";
        imgClone.style.height = "20px";
        imgClone.style.opacity = "0.5";
    }, 50);

    setTimeout(()=>{
        imgClone.remove();
    }, 1000);
}

/*---------------------------*/
//SHOWING TOAST FUNCTIONALITY
/*--------------------------*/
function showToast(){
    const toastEl = document.getElementById("cartToast");
    if(!toastEl) return;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}
/* -----------------------------*/
//IMPLEMENTING SEARCH LISTENER
/* -----------------------------*/
function enableSearch(){
    const searchInput = document.getElementById("menu-search");
    if(!searchInput) return;
    searchInput.addEventListener("input", function(){
        searchQuery = this.value.toLowerCase();
        renderMenu();
    });
}
/*------------------------------*/
//DROPDOWN MENU BUTTON
/*------------------------------*/
function enableCategoryDropdown(){
    const dropdown = document.getElementById("category-filter");
    if(!dropdown) return;

    dropdown.addEventListener("change", function(){
        currentCategory = this.value;
        renderMenu();
    });
}


/* -----------------------------*/
// FILTER BUTTONS
/* -----------------------------*/
function enableMenuFilters(){
    const buttons = document.querySelectorAll(".menu-filter");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            currentCategory = btn.dataset.category;
            renderMenu();
        });
    });
}

/*------------------------------*/
// ENHANCING FOCUS SEARCH
/*------------------------------*/
function focusSearch(){
    const search = document.getElementById("menu-search");
    if(search){
        search.focus();
    }
}
/* -----------------------------*/
// RESERVATION VALIDATION
/* -----------------------------*/

function enableReservationForm(){
    const form = document.querySelector("form");
    if(!form) return;
    form.addEventListener("submit", function(e){
        e.preventDefault();//PREVENTING DEFAULT ON SUBMIT
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const party = document.getElementById("party").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const notes = document.getElementById("notes").value.trim();
        const newsletter = document.getElementById("myCheckbox").checked;
        const seating = document.querySelector('input[name="seating"]:checked');

        let errors = [];
        if(name === "" || name.length > 20)
            errors.push("-Name is required and must be 20 or less characters.");
        if(email === "" || !email.includes("@"))
            errors.push("-Valid email is required.");
        if(party === "")
            errors.push("-Party size is required.");
        if(date === "")
            errors.push("-Reservation date required.");
        if(time === "")
            errors.push("-Reservation time required.");
        if(!seating)
            errors.push("-Please select seating preference.");
        if(notes.length > 30)
            errors.push("-Dietary notes must be 30 or less characters.");
        /* ---------------------------------------*/
        //DISPLAYING RESERVATION FORM ERROR RESULTS
        /* ---------------------------------------*/
        const alertContainer = document.getElementById("form-alert");

        if(errors.length > 0){
            alertContainer.innerHTML =
                `<div class="alert alert-danger">
                ${errors.join("<br>")}
            </div>`;
            return;
        }
        const reservation = {
            name:name,
            email:email,
            partySize:party,
            date:date,
            time:time,
            seating:seating.value,
            dietaryNotes:notes,
            newsletter:newsletter
        };
        console.log(reservation);//LOGGING FORM VALUES TO THE CONSOLE
        /* -----------------------------------------*/
        //DISPLAYING RESERVATION FORM SUCCESS RESULTS
        /* -----------------------------------------*/
        alertContainer.innerHTML =
            `<div class="alert alert-success">
            Reservation request submitted successfully!
        </div>`;
        form.reset();
    });
}
/* -----------------------------*/
// RESET PAGES UPON LOAD
/* -----------------------------*/
document.addEventListener("DOMContentLoaded",()=>{
    renderMenu();
    enableMenuFilters();
    enableCategoryDropdown();
    enableSearch();
    focusSearch();
    enableAddToCart();
    renderCart();
    enableCartButtons();
    updateCartBadge();
    enableReservationForm();
    highlightActivePage();
});