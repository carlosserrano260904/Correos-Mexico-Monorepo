# Contributing to Correos México

Gracias por contribuir al proyecto. Por favor sigue estas reglas básicas antes de enviar PRs.

---

## 1. Flujo de trabajo de ramas

- **main**: código estable y en producción. Nunca pushear directo; merge solo vía PR.  
- **develop**: rama de integración. Merge de features y hotfixes, siempre compilable.  
- **feature/**: funcionalidades por equipo. Ejemplo: `feat-backend/login`, `feat-frontend/form`.  
- **hotfix/**: correcciones urgentes desde `main`.  
- **release/**: preparación de release. Merge a `main` y tag correspondiente.

> Cada rama feature depende del equipo: backend, frontend, testers, ciberseguridad, base de datos, etc.

---

## 2. Naming de ramas y commits

- **Feature:** `feat-<equipo>/<funcionalidad>`  
- **Hotfix:** `hotfix/<descripcion>`  
- **Release:** `release/<version>`  

**Commits (Conventional Commits):**  

<tipo>[alcance opcional]: <descripción corta>


Tipos más usados: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`.  

Ejemplo: `feat-backend: agregar endpoint login`

---

## 3. Pull Requests

- Merge a `develop` o `main` solo vía PR.  
- PR debe incluir:
  - Descripción clara de cambios.
  - Referencia a issue si aplica.
  - Revisores asignados (mínimo 1 por equipo).  
- Todos los tests deben pasar antes de merge.

---

## 4. Buenas prácticas

1. Nunca pushear directo a `main` o `develop`.  
2. Mantener ramas actualizadas con `git fetch` y `git rebase`.  
3. Commits claros y concisos.  
4. Revisar cambios antes de abrir PR (`git diff`, `git status`).  
5. No subir dependencias innecesarias.  
6. Documentar funcionalidades nuevas en Notion o README.

---

## 5. Guía completa

Para instrucciones detalladas sobre GitFlow, clon/fork, fetch vs pull vs rebase, resolución de conflictos y ejemplos de commits, consulta la guía completa en Notion:

[Guía completa de contribución – Notion](https://www.notion.so/Administraci-n-Correos-de-M-xico-26448bb96bfa80ceaeb1fb46b347494c?p=27348bb96bfa8059838fca0d23257b9d&pm=c)
