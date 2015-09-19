/* 
 Library Graph 
 */

/**
 * Objet EquationGraph qui contient les paramètres et méthodes nécessaire à l'affichage de la fonction
 * @param {type} config contient les différents paramètres d'initialisation (id du canvas, min et max en X et Y, interval de graduation)
 * @returns {EquationGraph}
 */
function EquationGraph(config) {
    // Configuration defini par l'utilisateur 
    this.config = config;
    this.canvas = document.getElementById(config.canvasId);
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;
    this.minX = config.minX;
    this.minY = config.minY;
    this.maxX = config.maxX;
    this.maxY = config.maxY;
    this.intervalGraduation = config.intervalGraduation;

    // Constante
    this.axisColor = '#000000';
    this.gridColor = "#D1D1D1";
    this.gridSize = 1;
    this.font = '10pt Calibri';
    this.fontTime = '12pt Calibri';
    this.tickSize = 15;
    this.freqEch = 20;

    // Variable global
    this.context = this.canvas.getContext('2d');
    this.interval = null;
    this.animate = false; // Par defaut les courbes sont inanimées
    this.equations = []; // tableau des equations, couleur des courbes et les tailles de trait
    this.rad = true; // affiche l'axe des X en radian
    this.periode = 2; // Période sur laquel on affiche la fonction
    this.periodique = true; // défini si la fonction se répete est pas sur un interval de 2PI
    this.deph = 0; // permet d'adapter au déphasage de la fonction
    this.commencerA = 0; // t auquel on commence l'affichage de la fonction
    this.vitesse = 1;   // vitesse à laquelle on lit le fichier
    // grag 
    // this.startDragging = [];
    // this.backDragging = [];

    /**
     * Initialisation
     * 
     */
    this.init = function init() {
        this.refresh();
    };

    /**
     * Rafraichissement du canvas afin de l'adapter au redimentionnement 
     */
    this.refreshCanvas = function () {
        this.canvas = document.getElementById(this.config.canvasId);
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.context.clearRect(0, 0, this.width, this.height);
        this.refresh();
    };

    /**
     * Rafraichi le canvas aux changements des paramètres
     * 
     */
    this.refresh = function refresh() {
        this.rangeX = this.maxX - this.minX; // nb de cases
        this.rangeY = this.maxY - this.minY; // nb de cases

        this.unitX = (this.width) / this.rangeX; // taille de la cases
        this.unitY = this.height / this.rangeY; // taille de la cases

        this.centerY = this.height * (this.maxY / (this.maxY - this.minY));
        this.centerX = 30;
        this.drawAxes();
        this.drawEquations();
    };

    /**
     * Redémarre la fonction à t=this.commencerA
     */
    this.reset = function () {
        this.drawEquations.seconds = this.commencerA;
        this.refresh();
    };

    /**
     * Dessine la grille, les axes X et Y, et les graduations
     * 
     */
    this.drawAxes = function () {
        var context = this.context;
        // On reinitialise le canevas
        context.clearRect(0, 0, this.width, this.height);
        context.save();
        // context.translate(this.centerX, this.centerY);

        if (this.rad) {
            unitX = (this.width - this.centerX) / this.periode;
        } else {
            unitX = (this.width - this.centerX) / this.rangeX;
        }
        // la grille en Y numerique
        context.beginPath();
        for (var xPos = this.centerX; xPos < this.width; xPos += unitX) {
            context.moveTo(xPos, -this.centerY);
            context.lineTo(xPos, this.height);
        }
        context.closePath();
        context.strokeStyle = this.gridColor;
        context.stroke();

        // la grille en X 
        context.beginPath();
        for (var yPos = 0; yPos <= this.height; yPos += this.unitY) {
            context.moveTo(this.centerX, yPos);
            context.lineTo(this.width, yPos);
        }

        context.closePath();
        context.strokeStyle = this.gridColor;
        context.stroke();

        context.restore();
        this.drawAxesX();
        this.drawAxesY();
    };

    /**
     * Dessine l'axe des Y avec ses graduations
     * 
     */
    this.drawAxesY = function () {
        context = this.context;

        context.save();
        this.context.beginPath();
        this.context.lineWidth = "0";
        this.context.fillStyle = '#fff';
        this.context.rect(0, 0, this.centerX, this.height);
        this.context.fill();

        // Y |
        context.beginPath();
        context.moveTo(this.centerX, 0);
        context.lineTo(this.centerX, this.height);
        context.closePath();
        context.strokeStyle = this.axisColor;
        context.stroke();

        context.beginPath();
        context.font = this.font;
        context.textAlign = 'right';
        context.textBaseline = 'middle';
        context.fillStyle = '#000';
        unit = this.maxY;
        for (var yPos = 0; yPos <= this.height; yPos += this.unitY) {

            context.moveTo(this.centerX - this.tickSize / 2, yPos);
            context.lineTo(this.centerX + this.tickSize / 2, yPos);

            context.fillText(unit, this.centerX - 10, yPos);
            unit -= this.intervalGraduation;
        }

        context.closePath();
        context.strokeStyle = this.axisColor;
        context.stroke();
        context.restore();
    };

    /**
     * Dessine l'axe des X avec ses graduations
     * 
     */
    this.drawAxesX = function () {
        context = this.context;

        context.save();

        // X |
        context.beginPath();
        context.font = this.font;
        this.context.font = this.fontTime;
        context.moveTo(this.centerX, this.centerY);
        context.lineTo(this.width, this.centerY);
        context.closePath();
        context.strokeStyle = this.axisColor;
        context.stroke();

        context.beginPath();
        if (this.rad) {
            unitX = (this.width - this.centerX) / this.periode;
            unit = this.minX;
            for (var xPos = this.centerX + unitX; xPos < this.width; xPos += unitX) {
                context.moveTo(xPos, this.centerY + this.tickSize / 2);
                context.lineTo(xPos, this.centerY - this.tickSize / 2);
                context.fillText(((unit > 0) ? (unit + 1) : "") + "π", xPos - 5, this.centerY + 20);
                // context.fillText(unit, xPos  ,7);
                unit += this.intervalGraduation;
            }
        } else {
            unitX = (this.width - this.centerX) / this.rangeX;
            unit = this.minX;
            for (var xPos = this.centerX; xPos < this.width; xPos += unitX) {
                context.moveTo(xPos, this.centerY + this.tickSize / 2);
                context.lineTo(xPos, this.centerY - this.tickSize / 2);
                // context.fillText(unit, xPos + this.drawEquations.t * -this.unitX ,7);
                unit += this.intervalGraduation;
            }
        }
        context.closePath();
        context.strokeStyle = this.axisColor;
        context.stroke();
        context.restore();
    };

    /**
     * Dessine toutes les équations fixes
     * 
     */
    this.drawEquations = function () {
        // Initialisation des axes X et Y 
        this.drawAxes();

        // Pour chaque équation
        for (var i = 0; i < this.equations.length; i++) {
            this.context.beginPath();
            this.context.save();
            this.context.beginPath();

            // On initialise les variables
            width = this.width - this.centerX; // Largeur affichée
            ox = this.centerX; // décale la courbe de "centerX" pixel sur l'axe des x
            t_max = this.periode * Math.PI; // période affiché avec PI comme unité
            oy = this.centerY;  // possition de l'axe y
            scale = this.unitY; // unité de l'axe Y
            step = this.freqEch;    // pas
            inc = 3.14 / step;  //pas en fonction de l'unité
            d = this.deph;  //déphasage
            // modulo qui permet d'avoir une courbe fixe lorsque l'on change la frequence d'échantillonnage
            modulo = (this.drawEquations.seconds) % t_max;
            // Place le curceur du canvas au t initial
            this.context.moveTo(ox, oy - (scale * this.equations[i].equation(this.drawEquations.seconds + d - modulo - t_max)));
            var y;
            // Trace chaque point
            for (var t = 0 - modulo - t_max; t <= 2 * t_max; t += inc) {
                // calcul du y dans le repère canvas
                y = scale * this.equations[i].equation((t) + this.drawEquations.seconds + d);
                // Calcul le x dans le repère canvas
                x = ((t) / t_max) * width;
                // trace la courbe
                this.context.lineTo(ox + x, oy - y);
            }
            this.context.lineJoin = 'round';
            this.context.lineWidth = this.equations[i].thickness;
            this.context.strokeStyle = this.equations[i].color;
            this.context.stroke();
            this.context.restore();
            this.drawAxesY();
        }
        // Draw the xAxis PI tick and the time
        this.context.font = this.fontTime;
        this.context.fillText("t = " + Math.floor(this.drawEquations.seconds), 40, 20);
        this.context.strokeStyle = this.axisColor;
        // Fait répéter la fonction quand t dépasse 2pi
        if (this.periodique) {
            this.drawEquations.seconds = (this.drawEquations.seconds - this.commencerA) % (2 * Math.PI) + this.commencerA;
        }
    };
    this.drawEquations.seconds = this.commencerA; // t initialisé à commencerA

    /**
     * Fonction qui fait évoluer le temps et rappelle la fonction d'animation
     * 
     */
    this.animeEquation = function () {
        var _this = this;
        this.drawEquations();
        this.drawEquations.seconds = (this.drawEquations.seconds + (1 * this.vitesse / 60));

        // si la courbe doit s'annimer 
        if (this.animate) {
            // on appel recursivement cette fonction
            window.requestAnimFrame(function () {
                _this.animeEquation();
            });
        }
    };

    /**
     * Commence la lecture de la fonction
     * 
     */
    this.startAnimate = function () {
        this.animate = true;
        this.animeEquation();
    };

    /**
     * Arrête la lecture de la fonction
     * 
     */
    this.stopAnimate = function () {
        clearTimeout(this.interval);
        this.animate = false;
        this.interval = null;
    };

    /**
     * Actualise l'echelle en Y
     * @param int min Y min
     * @param int max Y max
     * @returns {undefined}
     */
    this.actualiseEchelle = function (min, max) {
        this.maxY = max;
        this.minY = min;
        this.refresh();
    };

    /**
     * Ajoute une fonction dans le tableau de fonctions
     * @param int _id identiant de la courbe
     * @param string formule la formule à parcer
     * @param string _color couleur de la courbe
     * @param int _thickness épaisseur de la courbe
     * @returns {Boolean}
     */
    this.addEquation = function (_id, formule, _color, _thickness) {
        t = 0;
        x = 0;

        try {
            // On tranforme la formule pour qu'elle soit interprétable par eval
            formule = this.parseFormule(formule);
            // eval qui resort les erreurs
            eval('y = ' + formule + ';');
        } catch (e) {
            // console.log('e ', e);
            throw e;
            return false;
        }
        // eval qui attribu à _equation la fonction passée en paramètre
        eval('_equation = function(t) {return ' + formule + ' };');

        this.equations.push({id: _id, equation: _equation, color: _color, thickness: _thickness});

        // calcul des Y min et max 
        var max = -100000;
        var min = Number.MAX_VALUE;
        for (var itmp = -4 * Math.PI; itmp < 4 * Math.PI; itmp += 1) {
            if (!isNaN(_equation(itmp))) {
                max = Math.max(max, _equation(itmp));
                min = Math.min(min, _equation(itmp));
            }
        }
        if (max < min || _equation() == "Infinity") {
            throw "Fonction non valide";
        }
        if(min<19 && max>-19){
            max = Math.min(max, 19);
            min = Math.max(min, -19);
        }
        this.actualiseEchelle(Math.round(min) - 1, Math.ceil(max) + 1);

        return true;
    };

    /**
     * Getteur d'une equation en fonction de son _id
     * @param {type} _id identifiant de l'équation
     * @returns {Array|Boolean} l'équation demandé ou false si elle n'est pas trouvée
     */
    this.getEquation = function (_id) {
        for (var i = 0; i < this.equations.length; i++) {
            if (this.equations[i].id == _id) {
                return this.equations[i];
            }
        }
        return false;
    };


    /**
     * Supprime une équation
     * @param int _id identifiant de l'équation
     * @returns {Boolean} true si l'équation est supprimée, false sinon
     */
    this.removeEquation = function (_id) {
        equation = this.getEquation(_id);
        if (equation) {
            equation = this.equations.indexOf(equation);
            this.equations.splice(equation, 1);
            return true;
        }
        return false;
    };

    /**
     * On tranforme la formule pour qu'elle soit interprétable par eval
     * Et on lève les exceptions non gérée par eval
     * @param string formule à parser
     * @returns string la formule interprétable
     */
    this.parseFormule = function (formule) {
        formule = formule.replace(/ /g, "") //enlève les espaces
                .replace(/Math\./gi, "") // supprime les Math. entré par l'utilisateur
                .replace(/([0-9])\.([0-9])/g, "$1<virgule>$2") // on transforme les virgule temporairement
                .replace(/\./g, "*") // remplace les . par des *
                .replace(/<virgule>/g, ".") // remplace les <virgule> par des .
                .replace(/\)\(/g, ")*(") // ajoute les * entre ) et (
                .replace(/(\d)([a-zA-Z])/g, "$1*$2") // ajoute les * implicites
                .replace(/(sin\(|cos\(|tan\(|asin\(|acos\(|atan\(|exp\(|abs\(|round\(|ceil\(|floor\(|sqrt\(|log\(|pow\(|min\(|max\()/g, "Math.$1") //on ajoute nos propre Math.
                .replace(/PI|π|pi|Pi/g, "Math.PI") // ajoute les Math. à PI
                .replace(/(t)²/g, "($1*$1)") // gestion du ²
                .replace(/\((.+?)^\)\)²/g, "(($1)*($1))") // gestion du (...)²
                .replace(/(\/)(.*)/g, "$1$2"); // ne fait rien du tout

//        console.log(formule);
        // Et on lève les exceptions non gérée par eval
        if (/\)²/.test(formule))
            throw "Préférez les formules de type ((a+b)*(a+b)) à celle de type (a+b)²";
        if (/[^a-z]x/.test(formule))
            throw "Remplacez le paramètre x par t";
        if (/PI[a-z]/.test(formule))
            throw "Mettez l'opérateur désiré après PI";
        return formule;
    };
}

/**
 * Verifie si le param est un nombre
 * @param  {[type]}  n value à vérifier
 * @return {Boolean}   true si c'est un nombre
 */
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Fonction qui permet d'avoir une meilleur synchronisation aux rafraichissements de l'écran
 * @param {type} callback Fonction a appeler s'il n'y a pas de requestAnimationFrame sur le navigateur
 */
window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();