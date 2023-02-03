// shoetcut for localStorage function [g => getItems] [s => setItems] 
function loSt_s(kye, value) { return localStorage.setItem(kye, value) }
function loSt_g(kye) { return localStorage.getItem(kye) }

// shoetcut for sessionStorage function [g => getItems] [s => setItems] 
function seSt_s(kye, value) { return sessionStorage.setItem(kye, value) }
function seSt_g(kye) { return sessionStorage.getItem(kye) }

// function to handle the repeated toggle between elements 
function activeClassHandling(theArray, activeClass, targetEl) {
    theArray.forEach(element => {
        element.classList.remove(activeClass);
    });
    targetEl.classList.add(activeClass);
}

export {loSt_s, loSt_g, activeClassHandling};
