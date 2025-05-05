function addEventListeners() {
    document.getElementById("gen-choice-btn").addEventListener("click", () => {
        const p = parseInt(document.getElementById("prime1").value);
        const q = parseInt(document.getElementById("prime2").value);

        if (isNaN(p) || isNaN(q)) {
            console.error("p, q must be prime integers. ");
            return; 
        }
  
        const possiblePublicKeys = getPossiblePublicKeys(p, q);
        document.getElementById("possible-public-keys").textContent  = `${arrayToStr(possiblePublicKeys)}`;
    });
}