# ButtonDropdown
questo è un input dropdown con una ricerca sugli elementi della lista tramite click di un tasto sulla tastiera, es in un alista di provice se si clicca il tasto f si va verso le provice che iniziano con la f


questo è un componente totalmente dinamico, questo bottone con menù a discesa
funziona in questa maniera:

LOGICA: il bottone prende sia gli array che gli oggetti, per gli oggetti
dato che per prendere lo specifico oggetto c'è bisogno della chiave
in questo componente è generalizzata utilizzando displayKey quindi 
per mostrare un oggetto quando viene utilizzato questo componente come props, 
bisogna passare la chiave dell'oggetto, DisplayName è il nome che viene visualizzato
dall'utente, 
ES: displaykey = IT, displayName = Italia 

Con la proprietà text prende il testo da inserire nella <a> se selected non ha
nessun valore

ES: nella pagina Prodotto c'è un array che ha come chiave per gli oggetti TIPO
ogni oggetto ha il suo tipo specifico, quindi come props nel displayKey={'tipo'}
bisogna passare tipo

STILE: questo bottone prende il 100% della View quindi si adatta perfettamente 
al div che lo contiene quindi per regolare la larghezza del componente
bisogna modificare la View del div che lo contiene, con la proprietà 
backgroundColor a true avrà un colore di sfondo e non avrà il bordo
altriemnti con false avrà un bordo e il colore di sfondo sarà trasparente

percDropdownItem è la grandezza in % della finestra che si apre quando si clicca il bottone
se non viene passato nessun valore allora utilizzarà un valore di default,
il valore va passato con il % es: 10%

NB. l'importazione dell'icona e del file css devono essere cambiate a seconda di dove vengono posizionate all'interno del progetto
