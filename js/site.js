window.onload = function () {
    OS = new OscilloScope("equation", "myCanvas");
    OS.init();
};



/**
 * [OscilloScope description]
 * @param defautOnglet {Onglet par defaut}
 * @param idCanvas {id du canvas}
 */
function OscilloScope(defautOnglet, idCanvas) {
    this.onglet = defautOnglet;
    this.precOnglet = null;
    this.idCanvas = idCanvas;

    this.fileGraph = null;
    this.EquationGraph = null;

    this.numero = 1;

    /**
     * Initialisation de l'OcilloScope
     */
    this.init = function () {
        var _this = this;

        resizeCanvas();
        // on fait en sorte que le canva ait un ratio de 1:1
        window.addEventListener('resize', resizeCanvas, false);
        function resizeCanvas(e) {
            canvas = document.getElementById(_this.idCanvas);
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.width;
            if (_this.fileGraph)
                _this.fileGraph.refreshCanvas();
            if (_this.EquationGraph) {
                _this.EquationGraph.refreshCanvas();
            }
            _this.initOnglet();
        }
        // on active l'onglet par défaut
        _this.changeOnglet(_this.onglet);
        document.getElementById('A_afficheAideFonction').onclick = function () {
            document.getElementById("aideEquation").className = "";
            document.getElementById("aideFichier").className = "hidden";
            document.getElementById("A_afficheAideFonction").className = "btn btn-primary";
            document.getElementById("A_afficheAideFichier").className = "btn btn-default";
        };
        document.getElementById('A_afficheAideFichier').onclick = function () {
            document.getElementById("aideEquation").className = "hidden";
            document.getElementById("aideFichier").className = "";
            document.getElementById("A_afficheAideFonction").className = "btn btn-default";
            document.getElementById("A_afficheAideFichier").className = "btn btn-primary";
        };
    };

    /**
     * Change l'onglet 
     * @param  {nom du nouvel onglet}
     * @return {[type]}
     */
    this.changeOnglet = function (name) {
        document.getElementById('onglet_' + this.onglet).className = '';
        document.getElementById('onglet_' + name).className = 'active';
        document.getElementById('contenu_onglet_' + this.onglet).className = 'tab-pane ';
        document.getElementById('contenu_onglet_' + name).className = 'tab-pane active';
        this.precOnglet = this.onglet;
        this.onglet = name;
        this.initOnglet();
    };

    /**
     * Quand on change d'onglet on initialise la lib qu'il faut, sauf si on vient de l'onglet help
     * @return {[type]}
     */
    this.initOnglet = function () {
        // si on n'a pas initialisé les libs
        if (!this.fileGraph) {
            this.initFileGraph();
        }
        if (!this.EquationGraph) {
            this.initEquationsGraph();
        }

        if (this.onglet == "equation" && this.precOnglet != "aide" && this.precOnglet != "equation") {
            //this.initEquationsGraph();
            this.FG_PlayStop("stop");
            this.EquationGraph.refresh();
        } else if (this.onglet == "fichier" && this.precOnglet != "aide" && this.precOnglet != "fichier") {
            //this.initFileGraph();
            this.fileGraph.refreshCanvas();

            this.EG_PlayStop("stop");
        } else if (this.onglet == "aide" && this.precOnglet == "fichier") {
            // Sélection de l'aide fichier
            document.getElementById("aideEquation").className = "hidden";
            document.getElementById("aideFichier").className = "";
            document.getElementById("A_afficheAideFonction").className = "btn btn-default";
            document.getElementById("A_afficheAideFichier").className = "btn btn-primary";
        } else if (this.onglet == "aide" && this.precOnglet == "equation") {
            // Sélection de l'aide fonction
            document.getElementById("aideEquation").className = "";
            document.getElementById("aideFichier").className = "hidden";
            document.getElementById("A_afficheAideFonction").className = "btn btn-primary";
            document.getElementById("A_afficheAideFichier").className = "btn btn-default";
        }
    };

    /**
     * Initialisation de la lib des equations
     * @return {[type]}
     */
    this.initEquationsGraph = function () {
        var _this = this;
        this.EquationGraph = new EquationGraph({
            canvasId: this.idCanvas, // Id du canvas
            minX: 0, // Graduation sur l'axe des X negatif
            minY: -5, // Graduation sur l'axe des y negatif
            maxX: 20, // Graduation sur l'axe des X
            maxY: 5, // Graduation sur l'axe des Y
            intervalGraduation: 1
        });
        this.EquationGraph.init();
        this.EG_ajouter_equation(this.numero);

        document.getElementById('EG_ajouter_equation').onclick = function (e) {
            _this.EG_ajouter_equation();
        };
        document.getElementById('EG_ajouter_equation').onclick = function (e) {
            _this.EG_ajouter_equation();
        };
        document.getElementById('EG_ajouter_equation-xs').onclick = function (e) {
            _this.EG_ajouter_equation();
        };
        document.getElementById('EG_PlayStop').onclick = function (e) {
            _this.EG_PlayStop();
        };
        document.getElementById('EG_reset').onclick = function (e) {
            _this.EquationGraph.reset();
        };
        document.getElementById('EG_freqEch').onchange = function (e) {
            _this.EG_SetParam("EG_freqEch");
        };
        document.getElementById('EG_freqEch').onkeyup = function (e) {
            _this.EG_SetParam("EG_freqEch");
        };
        document.getElementById('EG_dephasage').onchange = function (e) {
            _this.EG_SetParam("EG_dephasage");
        };
        document.getElementById('EG_dephasage').onkeyup = function (e) {
            _this.EG_SetParam("EG_dephasage");
        };
        document.getElementById('EG_ymin').onchange = function (e) {
            _this.EG_SetParam("EG_ymin");
        };
        document.getElementById('EG_ymin').onkeyup = function (e) {
            _this.EG_SetParam("EG_ymin");
        };
        document.getElementById('EG_ymax').onchange = function (e) {
            _this.EG_SetParam("EG_ymax");
        };
        document.getElementById('EG_ymax').onkeyup = function (e) {
            _this.EG_SetParam("EG_ymax");
        };
        document.getElementById('EG_xmin').onchange = function (e) {
            _this.EG_SetParam("EG_xmin");
        };
        document.getElementById('EG_xmin').onkeyup = function (e) {
            _this.EG_SetParam("EG_xmin");
        };
        document.getElementById('EG_xmax').onchange = function (e) {
            _this.EG_SetParam("EG_xmax");
        };
        document.getElementById('EG_xmax').onkeyup = function (e) {
            _this.EG_SetParam("EG_xmax");
        };
        document.getElementById('EG_vitesse').onchange = function (e) {
            _this.EG_SetParam("EG_vitesse");
        };
        document.getElementById('EG_vitesse').onkeyup = function (e) {
            _this.EG_SetParam("EG_vitesse");
        };
        document.getElementById('EG_fp').onchange = function (e) {
            _this.EG_SetParam("EG_fp");
        };

    };

    /**
     * Ajoute un champ équation
     * @param {type} numero numéro de la question
     */
    this.EG_ajouter_equation = function (numero) {
        var _this = this;
        var container = document.getElementById('EG_equations_container');
        var equation = '<div class="form-group mrgn-bttm-md">' +
                '<label class="col-sm-1 "><h4>N.' + this.numero + '</h4></label>' +
                '<div class="col-sm-7">' +
                '<div class=" has-success has-feedback" id="EG_divInput_' + this.numero + '">' +
                '<input type="text" class="form-control" id="equation_' + this.numero + '"  onKeyup="OS.EG_OnChangeEquation(' + this.numero + ')" placeholder="Entrez une fonction ex: sin(t)" />' +
                '<span class="" id="icon_' + this.numero + '"></span>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-3 col-xs-8">' +
                '<select class="form-control EG_couleur" id="color_' + this.numero + '" onchange="OS.EG_OnChangeEquation(' + this.numero + ')">' +
                '<option value="blue">Bleu</option>' +
                '<option value="red">Rouge</option>' +
                '<option value="green">Vert</option>' +
                '<option value="orange">Orange</option>' +
                '<option value="magenta">Rose</option>' +
                '</select>' +
                '</div>' +
                '<div class="col-xs-1">' +
                '<button type="button" class="close form-control" id="EG_bouton_suppr_' + this.numero + '">' +
                '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span><span class="sr-only">Close</span>' +
                '</button>' +
                '</div>' +
                '</div>';

        var divRow = document.createElement("div");
        divRow.id = "EG_equ_" + this.numero;
        divRow.innerHTML = equation;
        container.appendChild(divRow);
        var inputEquation = document.getElementById('equation_' + this.numero);
        inputEquation.onChange = function () {
            this.EG_OnChangeEquation(_this.numero);
        };
        var boutonSuppr = document.getElementById('EG_bouton_suppr_' + this.numero);
        boutonSuppr.onclick = function (e) {
            container.removeChild(divRow);
        };

        this.numero++;
    };

    /**
     * Vérifie l'équation lorsqu'elle est modifiée
     * 
     */
    this.EG_OnChangeEquation = function (numeroEquation) {
        formule = document.getElementById("equation_" + numeroEquation).value;
        color = document.getElementById("color_" + numeroEquation).value;
        thickness = 3;

        this.EquationGraph.removeEquation(numeroEquation);
        var divInput = document.getElementById("EG_divInput_" + numeroEquation);
        var spanRetour = document.createElement("span");
        spanRetour.id = "EG_alert_" + numeroEquation;
        spanRetour.className = "alertEquation";
        try {
            var eltSpanRetour = document.getElementById("EG_alert_" + numeroEquation);
            if (eltSpanRetour) {
                divInput.removeChild(eltSpanRetour);
            }
            this.EquationGraph.addEquation(numeroEquation, formule, color, thickness);
            document.getElementById("EG_divInput_" + numeroEquation).className = "form-group has-feedback has-success";
            document.getElementById("icon_" + numeroEquation).className = "glyphicon glyphicon-ok form-control-feedback";
            document.getElementById("EG_ymin").value = this.EquationGraph.minY;
            document.getElementById("EG_ymax").value = this.EquationGraph.maxY;
        } catch (error) {
            spanRetour.innerHTML = error;
            divInput.appendChild(spanRetour);
            document.getElementById("EG_divInput_" + numeroEquation).className = "form-group has-feedback has-error";
            document.getElementById("icon_" + numeroEquation).className = "glyphicon glyphicon-warning-sign form-control-feedback";
        }
    };

    /**
     * Lecture / arrêt de la courbe
     * 
     */
    this.EG_PlayStop = function (force) {
        button = document.getElementById('EG_PlayStop');
        if (this.EquationGraph.animate || force == 'stop') {
            button.innerHTML = '<span class="glyphicon glyphicon-play" aria-hidden="true"></span> Lecture';
            this.EquationGraph.stopAnimate();
        } else {
            button.innerHTML = '<span class="glyphicon glyphicon-stop" aria-hidden="true"></span> Stop';
            this.EquationGraph.startAnimate();
        }
    };

    /**
     * Set un parametre de la lib equation graph
     * @param {[type]} variable non du parametre a modifier
     */
    this.EG_SetParam = function (variable) {
        var valeur = parseFloat(document.getElementById(variable).value);
        switch (variable) {
            case "EG_freqEch":
                if(this.testValeur(valeur, 0.1, 10000, "Fréquence d'échantillonnage")){
                    this.EquationGraph.freqEch = valeur;
                }
                break;
            case "EG_periode":
                if(this.testValeur(valeur, 1, 10000, "")){
                    this.EquationGraph.periode = valeur;
                }
                break;
            case "EG_dephasage":
                if(this.testValeur(valeur, -100, 100, "Déphasage")){
                    this.EquationGraph.deph = valeur;
                }
                break;
            case "EG_ymin":
                if(this.testValeur(valeur, -100000, this.EquationGraph.maxY, "Y max")){
                    this.EquationGraph.minY = valeur;
                }
                break;
            case "EG_ymax":
                if(this.testValeur(valeur, this.EquationGraph.minY, 100000, "Y min")){
                    this.EquationGraph.maxY = valeur;
                }
                break;
            case "EG_xmax":
                if(this.testValeur(valeur, 1, 100, "Durée affichée")){
                    this.EquationGraph.periode = valeur;
                }
                break;
            case "EG_xmin":
                if(this.testValeur(valeur, -1000, 1000, "Commencer à")){
                    this.EquationGraph.commencerA = valeur;
                }
                this.EquationGraph.reset();
                return null;
                break;
            case "EG_vitesse":
                if(this.testValeur(valeur, 0.1, 10000, "Vitesse de lecture")){
                    this.EquationGraph.vitesse = valeur;
                }
                break;
            case "EG_fp":
                this.EquationGraph.periodique = document.getElementById(variable).checked;
                break;
            default :
        }
        this.EquationGraph.refresh();
    };

    /**
     * Affiche une erreur si valeur n'est pas compris entre min et max
     * @param int valeur
     * @param int min
     * @param int max
     */
    this.testValeur = function (valeur, min, max, champ) {
        if (!isNumeric(valeur) || (valeur > max || valeur < min)) {
            document.getElementById("EG_erreurParam").className = "";
            document.getElementById("EG_loc_erreur").innerHTML = "Le champ " + champ + " doit être un nombre compris entre " + min + " et " + max;
            return false;
        } else {
            document.getElementById("EG_erreurParam").className = "hidden";
            return true;
        }
    };

    /**
     * Initialisation de la lib pour dessiner le fichier
     * @return {[type]}
     */
    this.initFileGraph = function () {
        var _this = this;
        this.fileGraph = new FileGraph({
            canvasId: this.idCanvas // Id du canvas
        });
        this.fileGraph.refreshCanvas();
        // Init des champs onChange 
        document.getElementById('FG_demarage').onchange = function (e) {
            _this.FG_SetParam("FG_demarage");
        };
        document.getElementById('FG_periodeVisible').onchange = function (e) {
            _this.FG_SetParam("FG_periodeVisible");
        };
        document.getElementById('FG_vitesseLecture').onchange = function (e) {
            _this.FG_SetParam("FG_vitesseLecture");
        };
        document.getElementById('FG_PlayStop').onclick = function (e) {
            _this.FG_PlayStop();
        };
        document.getElementById('FG_RedemaLecture').onclick = function (e) {
            _this.FG_RedemaLecture();
        };

        document.addEventListener("stopFG", function () {
            _this.FG_PlayStop();
        });

        document.addEventListener("onloadend_FG", function () {
            var fileProgress = document.getElementById('loading');
            fileProgress.style.display = 'none';
        });

        document.addEventListener("errorFG_demarage", error);
        document.addEventListener("errorFG_periode", error);
        document.addEventListener("errorFG_vitessLecture", error);
        // on affiche les erreurs 
        function error(e) {
            buttonLecture = document.getElementById('FG_PlayStop');
            buttonLecture.disabled = true;
            zErr = document.getElementById('errorZone');
            zErr.innerHTML = '<div class="alert alert-danger" role="alert"><strong>Attention ! </strong>' + e.detail + '</div>';


        }

        document.addEventListener("lectureOK_FG", function (e) {
            buttonLecture = document.getElementById('FG_PlayStop');
            buttonLecture.disabled = false;
            
        

            zErr = document.getElementById('errorZone');
            zErr.innerHTML = "";
        });
        // on initialise le drag and drop pour l'onglet FileGraph
        this.initDragAndDrop();
    };

    /**
     * Intitialisation du drag and drop
     * @return {[type]}
     */
    this.initDragAndDrop = function () {
        CloseFile();
        var dropZone = document.getElementById('drop-zone');
        var uploadForm = document.getElementById('js-upload-form');
        var fileSelect = document.getElementById('js-upload-file');
        var fileSubmit = document.getElementById('js-upload-submit');
        var cmdZone = document.getElementById('commande-zone');
        cmdZone.style.display = 'none';
        var fileProgress = document.getElementById('loading');
        fileProgress.style.display = 'none';
        var _this = this;

        // Quand on ajoute un fichier 
        // On verifi son type mime avant de l'analyser
        var preUpload = function (files) {
            var file = files[0];
            console.log('file ', file);
            var filePreview = document.getElementById('js-upload-file-preview');
            filePreview.innerHTML = "";
            var fileSubmit = document.getElementById('js-upload-submit');
            fileSubmit.disabled = true;
            if (file.type == 'text/plain') {
                //document.getElementById('drop-zone').style.display = 'none';
                nDiv = '<div class="alert alert-success alert-dismissible" role="alert">' +
                        '<button type="button" class="close" id="closeFile"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                        '<strong>Vous avez choisi le fichier :</strong> ' + file.name + '' +
                        '</div>';

                filePreview.innerHTML = nDiv;
                fileSubmit.disabled = false;

            } else {
                nDiv = '<div class="alert alert-danger alert-dismissible" role="alert">' +
                        '<button type="button" class="close" id="closeFile"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                        '<strong>Le fichier n\'est pas dans un format texte valide</strong> ' + file.name + '' +
                        '</div>';

                filePreview.innerHTML = nDiv;
                fileSubmit.disabled = true;
            }
            // On re affiche le formulaire quand on ferme le fichier
            var closeFile = document.getElementById('closeFile');
            closeFile.addEventListener("click", CloseFile);

        };

        function CloseFile() {
            //document.getElementById('drop-zone').style.display = 'block';
            var filePreview = document.getElementById('js-upload-file-preview');
            filePreview.innerHTML = "";
            var fileSubmit = document.getElementById('js-upload-submit');
            fileSubmit.disabled = true;
            var fileSelect = document.getElementById('js-upload-file');
            fileSelect.value = "";
            var uploadForm = document.getElementById('js-upload-form');
            uploadForm.style.display = 'block';
            var cmdZone = document.getElementById('commande-zone');
            cmdZone.style.display = 'none';
            return false;
        }
        // si il y a des erreur
        document.addEventListener("errorFG_FormatFichier", function (e) {
            CloseFile();
            var filePreview = document.getElementById('js-upload-file-preview');
            nDiv = '<div class="alert alert-danger" role="alert"><strong>Attention ! </strong>' + e.detail + '</div>';
            filePreview.innerHTML = nDiv;

        });
        // pre Upload
        fileSelect.addEventListener("change", function (e) {
            preUpload(e.target.files);
        });
        // Upload
        uploadForm.addEventListener("submit", function (e) {
            e.preventDefault();

            var uploadForm = document.getElementById('js-upload-form');
            uploadForm.style.display = 'none';
            var cmdZone = document.getElementById('commande-zone');
            cmdZone.style.display = 'block';
            var file = document.getElementById('js-upload-file').files[0];


            var fileProgress = document.getElementById('loading');
            fileProgress.style.display = 'block';

            _this.fileGraph.readFile(file);

        });

        dropZone.ondrop = function (e) {
            e.preventDefault();
            this.className = 'upload-drop-zone';
            document.getElementById('js-upload-file').files = e.dataTransfer.files;
            preUpload(e.dataTransfer.files);
        };

        dropZone.ondragover = function () {
            this.className = 'upload-drop-zone drop';
            return false;
        };

        dropZone.ondragleave = function () {
            this.className = 'upload-drop-zone';
            return false;
        };

        function updateProgress(evt) {

        }
    };

    /**
     * Set un parametre de la lib FileGraph
     * @param {[type]} variable nom du parametre à modifier
     */
    this.FG_SetParam = function (variable) {
this.fileGraph.error = false;
                this.fileGraph.setdemarrage(parseFloat(document.getElementById("FG_demarage").value));
                this.fileGraph.setPeriodeVisible(parseFloat(document.getElementById("FG_periodeVisible").value));
                this.fileGraph.setVitesseLecture(parseFloat(document.getElementById("FG_vitesseLecture").value));
    };
    /**
     * File Graph Lecture Stop
     */
    this.FG_PlayStop = function (force) {
        button = document.getElementById('FG_PlayStop');
        if (this.fileGraph.animate || force == 'stop') {
            button.innerHTML = '<span class="glyphicon glyphicon-play" aria-hidden="true"></span> Lecture';
            this.fileGraph.stopAnimate();
        } else {
            button.innerHTML = '<span class="glyphicon glyphicon-stop" aria-hidden="true"></span> Stop';
            this.fileGraph.startAnimate();
        }
    };

    /**
     * Redémarrage de la lecture (animation) du fichier
     */
    this.FG_RedemaLecture = function () {
        this.fileGraph.resetAnimate();
    };

    /**
     * Verifie si le param est un nombre
     * @param  {[type]}  n value à vérifier
     * @return {Boolean}   true si c'est un nombre
     */
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}
