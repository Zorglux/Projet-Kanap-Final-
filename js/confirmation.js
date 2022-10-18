/* récupère l'url, sépare l'id de l'url pour le retourner */ 

function recupereIdDeCommande(){
    const url = new URLSearchParams(window.location.search)
    return idDeCommande = url.get("id")
    }
    // ===========================================================
    
    
    /* récupère l'id pour le placer dans le DOM */  
    function placeIdDeCommande(){
      const id = recupereIdDeCommande()
      const placement = document.getElementById("orderId")
      placement.innerText = id
    
      videLocalStorage()
    }
    // ============================================================ 
    
    
    
    /* vide le localStorage */ 
    
    function videLocalStorage(){
        localStorage.clear()
    }
    // =============================================================
    
    
    placeIdDeCommande()