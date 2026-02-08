# PortfolioPDB

Pablo Dominguez's Personal Page

Ciclo de vida de la construcción de esta página:

# 1) partir de main actualizado

git checkout main
git pull

# 2) crear rama

git checkout -b feature/footer-links

hacer los desarrollos...

# 3) trabajar + commits

git add .
git commit -m "Improve footer with social links"

# 4) subir rama

git push -u origin feature/footer-links

# 5) PR en GitHub → merge a main

# 6) volver a main y limpiar

git checkout main
git pull
git branch -d feature/footer-links

# 7) worker en cloudfare:

https://portfoliopdb-counter.pablo-dominguezb.workers.dev/

# 8) slugs (artículos)

data-article="retro-primeros-cuatro-años"
data-article="golden-circle-en-trabajo"
data-article="retro-segundos-cuatro-años"
data-article="liderazgo-interior"
