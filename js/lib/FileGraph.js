/* 
		Created on : 8 oct. 2014, 14:50:06
		Author     : Gat, Thibaud
		Library FileGraph 

		Param : config.[canvasId]
*/
function FileGraph(config) {
	this.config = config;

    // Configuration defini par l'utilisateur 
    this.canvas = document.getElementById(config.canvasId);
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Variable global
    this.fileFrequence = null;
    this.fileValue = [];	 // Valeurs du fichier
    this.fileValue_Min = []; // Valeurs minifier du fichier en fonction des parametres 
    this.maxMinAbs = 0; 	 // maximum apsolue des valeurs du fichier
    this.error = false;		 // si il y a des erreurs 
    this.eventStop = null;	 // On cree un event qui informe que la lecture est stoper
    this.eventLectureOK = null; // On cree un evnt qui informe que l'on peut demarer la lecture
    this.animate = false; 	 // si la fonction est annime 
    this.nextSeconde = 0;
    
    this.context = this.canvas.getContext('2d');

    this.demarrage = 0 			// Démarrage (seconde)
    this.periodeVisible = 1.0   // Temps à afficher (seconde)
    this.vitesseLecture = 0.1   // Vitesse de lecture
    
    /**
     * Rafraichissement du canvas afin de l'adapter di redimentionnement 
     */
    this.refreshCanvas = function() {
    	this.canvas = document.getElementById(this.config.canvasId);
    	this.width = this.canvas.width;
    	this.height = this.canvas.height;

        this.context.clearRect(0, 0, this.width, this.height);
        this.refreshAnimate();
    }

    /**
     * Set la variable de demarage 
     * Retourne l'erreur si il y en a 
     * @param {[type]} value [description]
     */
    this.setdemarrage = function(value) {
    	
    	this.eventLectureOK = null;
        if (value < 0) {
        	this.error = true;
        	var ev = new CustomEvent("errorFG_demarage", {
				detail: "la valeur de démarrage doit être positive."
			})
			document.dispatchEvent(ev);
            // this.demarrage = 0;
        } else if(!isNumeric(value)) {
        	this.error = true;
        	var ev = new CustomEvent("errorFG_demarage", {
				detail: "la valeur de démarage doit être un nombre."
			})
			document.dispatchEvent(ev);
            // this.demarrage = 0;
        } else if(!this.findByX(0,value) && value != 0) {
        	this.error = true;
        	var ev = new CustomEvent("errorFG_demarage", {
				detail: "la valeur démarrage ne peut pas être plus grande que : "+this.fileValue[this.fileValue.length-2].x
			})
			document.dispatchEvent(ev);
            // this.demarrage = 0;
        } else if(value + this.periodeVisible > this.fileValue[this.fileValue.length - 2].x) {

            this.error = true;
            var ev = new CustomEvent("errorFG_demarage", {
                detail: "la valeur 'Temps à afficher' + la valeur du 'Démarrage' ne peut ne peut pas être plus grande que : "+this.fileValue[this.fileValue.length-2].x+"<br>"+
                "minimum 4 points sur le canvas "
            })
            document.dispatchEvent(ev);
            // this.demarrage = 0;
        } else {
            this.demarrage = value;

        }
        
        this.refreshAnimate();
        this.resetAnimate();
    }
    /**
     * Set la variable Periode Visible
     * Retourne l'erreur si il y en a 
     * @param {[type]} value [description]
     */
    this.setPeriodeVisible = function(value) {
    	
    	this.eventLectureOK = null;
        if (value < 0) {
        	this.error = true;
        	var ev = new CustomEvent("errorFG_periode", {
				detail: "la valeur Temps à afficher doit être positive."
			})
			document.dispatchEvent(ev);
            // this.periodeVisible = 0;
        } else if(!isNumeric(value)) {
        	this.error = true;
        	var ev = new CustomEvent("errorFG_periode", {
				detail: "la valeur Temps à afficher doit être un nombre."
			})
			document.dispatchEvent(ev);
            // this.periodeVisible = 0;
        } else if(this.findByX(0,value) == null) {

        	this.error = true;
        	var ev = new CustomEvent("errorFG_periode", {
				detail: "la valeur Temps à afficher ne peut pas être plus grande que : "+this.fileValue[this.fileValue.length-2].x
			})
			document.dispatchEvent(ev);
            // this.periodeVisible = 0;
        } else if(value < this.fileValue[1].x) {

        	this.error = true;
        	var ev = new CustomEvent("errorFG_periode", {
				detail: "la valeur Temps à afficher ne peut pas être plus petite que : "+this.fileValue[4].x+"<br>"+
				"minimum 4 points sur le canvas "
			})
			document.dispatchEvent(ev);
            // this.periodeVisible = 0;
        } else if(value + this.demarrage > this.fileValue[this.fileValue.length - 2].x) {

            this.error = true;
            var ev = new CustomEvent("errorFG_periode", {
                detail: "la valeur 'Temps à afficher' + la valeur du 'Démarrage' ne peut ne peut pas être plus grande que : "+this.fileValue[this.fileValue.length-2].x+"<br>"+
                "minimum 4 points sur le canvas "
            })
            document.dispatchEvent(ev);
            // this.periodeVisible = 0;
        } else {
            this.periodeVisible = value;

        }
        
        this.refreshAnimate();
        this.resetAnimate();
    }
    /**
     * Set la varriavle de la vitesse de lecture 
     * Retourne l'erreur si il y en a 
     * @param {[type]} value [description]
     */
    this.setVitesseLecture = function(value) {
    	
    	this.eventLectureOK = null;
        if (value < 0) {
        	this.error = true;
        	var ev = new CustomEvent("errorFG_vitessLecture", {
				detail: "la valeur Vitesse de lecture doit être un nombre."
			})
			document.dispatchEvent(ev);
            // this.vitesseLecture = 0;
        } else if(!isNumeric(value)) {
        	this.error = true;
        	var ev = new CustomEvent("errorFG_vitessLecture", {
				detail: "la valeur Vitesse de lecture doit être un nombre."
			})
			document.dispatchEvent(ev);
            // this.vitesseLecture = 0;
        } else if(value < this.fileValue[2].x) {
            this.error = true;
            var ev = new CustomEvent("errorFG_vitessLecture", {
                detail: "la valeur Vitesse de lecture plus grande que "+this.fileValue[2].x
            })
            document.dispatchEvent(ev);
            // this.vitesseLecture = 0;
        } else {
            this.vitesseLecture = value;

        }
        
        this.refreshAnimate();
    }

    /**
     * Acctualisation
     *
     */
    this.refresh = function() {
        _this = this;
        // si on a un fichier a afficher 
        /*if ((this.fileValue) && (this.fileFrequence)) {
            _this.drawGraph();
            if (_this.animate) {
                _this.startAnimate();
            }
        }*/
    }

    /**
     * Lecture du fichier avec file reader
     * @param  {[type]} file le fichier
     */
    this.readFile = function(file) {
    	this.fileValue = [];
    	this.fileValue_Min = [];
        if (typeof window.FileReader === 'undefined') {
            // state.className = 'fail';
            alert('Erreur : FileReader n\'est pas supporté par le navigateur');
        } else {
            // state.className = 'success';
            // state.innerHTML = 'File API & FileReader available';
        }
        var fr = new FileReader();
        var _this = this;
        fr.onload = function(event) {
            _this.readerHandler(event.target.result, file);
            // on affiche le graph
            _this.refreshAnimate();
        };
        fr.readAsText(file);
        fr.onprogress = function(event) {
        console.log('event ' , event);
		    if (event.lengthComputable) {
		    console.log('event.total ' , event.total);
		    console.log('event.loaded ' , event.loaded);
		    }
		};
		fr.onloadend = function(event) {
 
			onloadend = new CustomEvent("onloadend_FG", true);
        	document.dispatchEvent(onloadend);

		    
		};
    }
    /**
     * Lecture du contenu du fichier ligne par ligne
     * afin de parser/verifier le contenu
     * Si le contenu est bon : l'enregiste dans un array : this.fileValue
     */
    this.readerHandler = function(result, file) {
    	this.fileValue = [];
    	this.fileValue_Min = [];
    	if (file.type == 'text/plain') {
	        // By lines
	        var re = /^(\d+)\r?\n([-+]?([0-9]*\.[0-9]+|[0-9]+)\t[-+]?([0-9]*\.[0-9]+|[0-9]+)\r?\n)+$/; 


			if(re.test(result)) {

				var lines = result.split('\n');
				for (var line = 0; line < lines.length; line++) {
				    if (lines[line]) {
		                if (line == 0) {
		                	this.fileFrequence = lines[line];
		                } else {
		                	splitLine = lines[line].split("	");
							function Value(x, y) {
		                        this.x = x;
		                        this.y = y;
		                    }
		                    value = new Value(splitLine[0], splitLine[1]);
		                    this.fileValue.push(value);
		                    // on garde en memoire la valeur absolue max pour la mise a l'echele sur l'axe des Y
		                    if(this.maxMinAbs <= Math.abs(value.y))
		                    	this.maxMinAbs = value.y;
		                }
		            }
		        }

			} else {
				this.error = true;
	        	var ev = new CustomEvent("errorFG_FormatFichier", {
					detail: "Le fichier " + file.name + " n'est pas dans le bon format : Erreur de parsage"
					})
				document.dispatchEvent(ev);
				return false;
			}
		} else {
			this.error = true;
			var ev = new CustomEvent("errorFG_FormatFichier", {
					detail: "Le fichier " + file.name + " n'est pas dans le bon format : Erreur de type mime"
				})
			document.dispatchEvent(ev);
			return false;
		}
        return true;
    }


    /**
     * Recherche le point en x le plus proche du temps donné en param
     */
    this.findByX = function(start,t) {
        var temps, i_temps;

        for (var i = start; i < this.fileValue.length; i++) {
            if(this.fileValue[i] !== null && typeof this.fileValue[i] === 'object') {
                if (this.fileValue[i].x > t) {
                    return i_temps;
                };
                temps = this.fileValue[i].x;
                i_temps = i;
            } else {
            console.log('this.fileValue[i] ' , this.fileValue[i],i);

            }
        };
        return null;
    }
	/**
     * Recherche le point en x le plus proche du temps donné en param
     */
    this.findByX_min = function(start,t) {
        var temps, i_temps;

        for (var i = start; i < this.fileValue_Min.length; i++) {
            if(this.fileValue_Min[i] !== null && typeof this.fileValue_Min[i] === 'object') {
                if (this.fileValue_Min[i].x > t) {
                    return i_temps;
                };
                temps = this.fileValue_Min[i].x;
                i_temps = i;
            } else {

            console.log('this.fileValue_Min[i] ' , this.fileValue_Min[i],i);
            }
        };
        return null;
    }

    /**
     * Affiche le graph en conftion des parametres
     * @param  {float} nextFrame Debut du fichier 
     */
    this.drawGraph = function(nextFrame) {
		
    	// Initialisation des valeur a afficher
    	if(this.fileValue_Min.length == 0) {

    		// si la periode visible est plus grande que le fichier
	        if ((this.demarrage + this.periodeVisible) > this.fileValue[this.fileValue.length - 1].x) {
	            this.periodeVisible = parseFloat(this.fileValue[this.fileValue.length - 1].x - this.periodeVisible);
	        }

    		// index de debut et de fin de la perode a afficher
	        var i_startX = this.findByX(0,this.demarrage +  nextFrame);
	        var i_stopX = this.findByX(i_startX,this.demarrage + this.periodeVisible + nextFrame);

	        // si on est a la fin du fichier
			if (!i_stopX ) {
				// event pour le bouton play stop
				this.eventStop = new CustomEvent("stopFG", true);
        		document.dispatchEvent(this.eventStop);
	            this.stopAnimate();
	            i_startX = this.findByX(0,parseFloat(this.fileValue[this.fileValue.length - 1].x) - this.periodeVisible);
                if(!i_startX)
                    i_startX = 0;
	            i_stopX = this.fileValue.length - 1;
	        }

	        // si on a plus de point que de pixel on ne garde que 2 point par pixel
    		if((i_stopX - i_startX) > (this.width*3) ) {
	    		increment = parseInt( (i_stopX - i_startX) / (this.width*3) )
    		} else {
    			increment = 1;
    		}
    		// on crée le tableu minifier
    		for (var i = 0; i < this.fileValue.length; i +=  increment ) {
                
            if(this.fileValue[i] === null && typeof this.fileValue[i] !== 'object') {
                    console.log("und", i)
                }
    			this.fileValue_Min.push(this.fileValue[i])
    		};
    	}


    	// index de debut et de fin de la perode a afficher des valeur minifier
        var i_startX = this.findByX_min(0,this.demarrage +  nextFrame);
        var i_stopX = this.findByX_min(i_startX,this.demarrage + this.periodeVisible + nextFrame);

        // si on est a la fin du fichier
		if (!i_stopX ) {
			// event pour le bouton play stop
			this.eventStop = new CustomEvent("stopFG", true);
        	document.dispatchEvent(this.eventStop);
            this.stopAnimate();
            i_startX = this.findByX_min(0,parseFloat(this.fileValue_Min[this.fileValue_Min.length - 1].x) - this.periodeVisible);
            if(!i_startX)
                i_startX = 0;
            i_stopX = this.fileValue_Min.length - 1;
        }
        
        // on efface le context
        this.context.clearRect(0, 0, this.width, this.height);

        // Apercu du fichier en entier
        this.drawFullGraph();
        
        // Rectange de l'Appercu du fichier
        var startSelect = parseInt(i_startX * this.width / (this.fileValue_Min.length-1) );
        var stopSelect  = parseInt(i_stopX * this.width / (this.fileValue_Min.length-1) );
        this.selectGraphRect(startSelect, stopSelect);

        var centerY = this.height / 2 - (this.height /20);
        var centerX = 0;
        this.context.beginPath();

        // on init le 1er ponit 
        var x = parseFloat(this.fileValue_Min[0].x - this.fileValue_Min[i_startX].x) / parseFloat(this.fileValue_Min[i_stopX].x - this.fileValue_Min[i_startX].x) * this.width;
        var y = parseFloat(this.fileValue_Min[0].y) * ((centerY ) / parseFloat(this.maxMinAbs));
        this.context.moveTo(x, centerY + y);

        // pour tous les points
        for (var i =i_startX; i < i_stopX; i++) {
        	// clacule de la position de X 
            x = parseFloat(this.fileValue_Min[i].x - this.fileValue_Min[i_startX].x) / parseFloat(this.fileValue_Min[i_stopX].x - this.fileValue_Min[i_startX].x) * this.width;
            // mise a l'echelle sur l'ax de Y en fonction de la variable maxMinAbs 
            y = parseFloat(this.fileValue_Min[i].y) * ((centerY ) / parseFloat(this.maxMinAbs));
            this.context.lineTo(x, centerY + y);
        };

        this.context.lineWidth = 1;
        this.context.strokeStyle = '#285E8E';
        this.context.stroke();
    }


    /**
     * Annimation de la courbe toute les 60 fps
     */
    this.animeEquation = function() {
    	this.eventStop = null;
    	var _this = this;
    	// on descine le graph
        this.drawGraph( this.nextSeconde );

        // on increment le compteur en fonction de la vitesse de lecture diviser par le nombre de fps
        this.nextSeconde += (1*this.vitesseLecture/60);

        // si la courbe doit s'annimer 
    	if(this.animate) {
    		// on appel recursivement cette fonction
        	window.requestAnimFrame( function() { _this.animeEquation(); } );
    	}
    }
    

    /**
     *	Demarage de l'annimation du graph
     */
    this.startAnimate = function() {
        this.animate = true;
    	// si on n'a pas d'erreur
    	if(this.error == false && this.fileValue.length != 0)
        	this.animeEquation(0);
    }

    /**
     *	On stop l'annimation du graph
     */
    this.stopAnimate = function() {
        this.animate = false;
    }

    /**
     * Refresh de l'nnimation si on modifie des paramettres
     */
    this.refreshAnimate = function() {
    	this.fileValue_Min = [];
    	// si on n'a pas d'erreur
    	if(this.error == false && this.fileValue.length != 0) {
    		this.drawGraph(this.nextSeconde);
    		this.eventLectureOK = new CustomEvent("lectureOK_FG", true)
    		document.dispatchEvent(this.eventLectureOK);
    	}
    }


    /**
     * Redemarage du defilement du graph
     */
    this.resetAnimate = function() {
        this.nextSeconde = 0;
        this.fileValue_Min = [];
    	// si on n'a pas d'erreur
    	if(this.error == false && this.fileValue.length != 0)
        	this.drawGraph(this.nextSeconde )
    }
    /**
     * Rectangle de selection
     * @params : debut et fin du rectangle sur l'ax des X en pixels
     */
    this.selectGraphRect = function(start, stop) {
        this.context.beginPath();
        this.context.rect(start, this.height - (this.height /10), (stop - start), (this.height /10));
        this.context.fillStyle = 'rgba(225,225,225,0.2)';
        this.context.fill();
        this.context.lineWidth = 1;
        this.context.strokeStyle = '#34743E';
        this.context.stroke();
    }
    /**
     * dessiner le graph en entier
     *
     */
    this.drawFullGraph = function() {
        var centerY = this.height - (this.height /20);
        var centerX = 0;
        this.context.beginPath();
        this.context.moveTo(centerX, centerY);
        var i = 0;
        var x = 0;
        while (i < this.fileValue.length) {
            x = parseFloat(this.fileValue[i].x) / parseFloat(this.fileValue[this.fileValue.length - 1].x) * this.width;
            y = parseFloat(this.fileValue[i].y) * ((centerY/20 ) / parseFloat(this.maxMinAbs));
            this.context.lineTo(x, centerY + y);
             // si on a plus de point que de pixel on ne garde que 2 point par pixel
    		if( this.fileValue.length > (this.width*3) ) {
	    		i+=parseInt( this.fileValue.length / (this.width*3) );
    		} else {
    			i++;
    		}
            
        };
        this.context.lineWidth = 1;
        this.context.strokeStyle = '#3c763d';
        this.context.stroke();
    }
}

/**
 * Annimation a 60 fps 
 * @param  {function} callback	fonction qui s'execute apres 
 * @return {function}     callback
 */

window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || // La fonction d'origine
        window.webkitRequestAnimationFrame 	|| // Pour Chrome et Safari.
        window.mozRequestAnimationFrame 	|| // Pour Firefox.
        window.oRequestAnimationFrame 		|| // Pour Opera.
        window.msRequestAnimationFrame 		|| // Pour Internet Explorer.
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();
/**
 * Verifie si le param est un nombre
 * @param  {[type]}  n value a verifier
 * @return {Boolean}   true si c'est un nombre
 */
function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}