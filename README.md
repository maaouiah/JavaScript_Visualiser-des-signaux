MultimediaNumerique
===================

Projet – Application Web Animation


##Les fonctionalitées
-  visualiser des signaux au cours du temps par
	- une fonction paramétrée par le temps 
	- charger depuis un fichier




##Pages :
- index
Choisir si on :
	- importe un fichier 
		Utilisation du drag and drop html5

		Dans le cas d’un signal contenu dans un fichier, il sera constitué d’une première ligne 
		contenant la fréquence d’échantillonnage suivie d’une liste de points (un point par ligne). 
		Chaque ligne indique la valeur de t et l’amplitude du point à ce temps t séparés par une 
		tabulation.
		```
		Exemple :
		2 // La fréquence d’échantillonage Fs
		0.0 	0.89 //t (en s) valeur 
		0.5 	0.234
		1.0 	1.2
		
		1.5 	0.345
		```


	 - saisie la fonction
	 	(Fs – combien de points par unité de temps) (les fonction trigonométriques et mathématiques usuelles 
devront être disponibles (sin, cos, tan, acos, atan, asin, log, exp, etc)) 
- visulisation
	Une fois la source du signal choisie, l’utilisateur pourra choisir la durée de temps qui correspond à la zone d affichage dW. Le zoom devra se régler automatiquement. 

- Responsive design bien évidemment 

- Exemple de fonction :
2cos(5x) / cos(10x)+1
