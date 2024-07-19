/* 

[Serão necessários algumas funções para alcançar um sistema de produtos estavél. A começar por:]

+ Uma função que puxa os produtos através de um arquivo JSON. 

+ Arquivo JSON:
    - Futuramente criar um sistema pelo servidor para adicionar e excluir produtos.
    - Esse produto terá 5 condicionantes:
        + 1- Imagem. 2- Nome. 3- Preço, 4- Descrição, 5- Tamanho. 6- Categorias.
    - Ele seguirá uma página base, sem nenhum dado realmente integrado.
    - Essa página poderá ser editada com novas sub-condionantes, por exemplo:
        + Opiniões e vídeos.

+ Integração desse arquivo JSON em duas partes:
    - Bicicletas; Acessórios e peças.
    - Showdown dos produtos.

*/

window.addEventListener("DOMContentLoaded", () => {
	fetch("js/json/bicicletas.json")
		.then((response) => {
			return response.json();
		})
		.then((bicicletas) => {
			let mountainBikes = bicicletas.mountainBikes;

			const container = document.getElementById("bicicletas");

			mountainBikes.forEach(function (modelo) {
				const prodCard = document.createElement("div");

				// Se modelo.categorias for uma string, divida-a em um array
				let categorias = modelo.categorias;
				if (typeof categorias === "string") {
					categorias = categorias.split(/\s+/); // Divide por qualquer quantidade de espaços em branco
				}

				// Adiciona cada categoria individualmente, verificando se é uma string
				prodCard.classList.add("prod-card");
				categorias.forEach((categoria) => {
					if (typeof categoria === "string" && categoria.trim()) {
						// Garante que categoria é uma string não vazia
						prodCard.classList.add(categoria.trim());
					}
				});

				const prodCardURL = document.createElement("a");
				prodCardURL.classList.add("prod-card-container");
				prodCardURL.setAttribute("href", modelo.url);

				const prodImg = document.createElement("img");
				prodImg.classList.add("produto");
				prodImg.setAttribute("src", modelo.imagem);

				const prodNome = document.createElement("p");
				prodNome.classList.add("produto-nome");
				prodNome.innerHTML = modelo.nomeAbrev;

				const prodValor = document.createElement("p");
				prodValor.classList.add("produto-valor");
				prodValor.innerHTML = modelo.valor;

				const prodDesc = document.createElement("p");
				prodDesc.classList.add("produto-desc");
				prodDesc.innerHTML = modelo.desc;

				const prodAdd = document.createElement("button");
				prodAdd.classList.add("adicionar");
				prodAdd.setAttribute("onclick", "addCarrinho()");
				prodAdd.innerHTML = "&#43;";

				prodCardURL.appendChild(prodImg);
				prodCardURL.appendChild(prodNome);
				prodCardURL.appendChild(prodValor);
				prodCardURL.appendChild(prodDesc);
				prodCard.appendChild(prodCardURL);
				prodCard.appendChild(prodAdd);

				container.appendChild(prodCard);
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

function addCarrinho() {
	// Implementação da função para adicionar a bicicleta ao carrinho
	alert("Bicicleta adicionada ao carrinho!");
}
