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

function atualizarValorTotal() {
	let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
	const valorTotal = document.querySelectorAll("#valor-total");

	let total = 0;

	if (carrinho.length > 0) {
		carrinho.forEach((bicicleta) => {
			// Supondo que bicicleta.valor seja algo como "1.234,56"
			let valorStr = bicicleta.valor;

			// Remove o separador de milhar e substitui a vírgula por ponto
			valorStr = valorStr.replace(".", "").replace(",", ".");

			// Converte a string para número
			const valor = parseFloat(valorStr);

			// Usa 1 como quantidade padrão, se não houver valor
			const quantidade = bicicleta.qty || 1;

			// Adiciona o valor total do item ao total geral
			total += valor * quantidade;
		});
	}

	// Função para formatar o valor total com separadores de milhar
	function formatarValor(valor) {
		return valor
			.toFixed(2)
			.replace(".", ",")
			.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}

	// Atualiza o valor total no DOM
	valorTotal.forEach((element) => {
		element.innerHTML = total === 0 ? "0,00" : formatarValor(total);
	});
}

window.addEventListener("DOMContentLoaded", () => {
	fetch("js/json/bicicletas.json")
		.then((response) => response.json())
		.then((bicicletas) => {
			let mountainBikes = bicicletas.mountainBikes;
			const container = document.getElementById("bicicletas");

			// Armazena os itens em um mapa para acesso rápido
			const itensMap = {};
			mountainBikes.forEach((modelo) => {
				itensMap[modelo.id] = modelo; // Supondo que cada modelo tem um campo id único
			});

			// Salva o mapa de itens no localStorage
			localStorage.setItem("itensMap", JSON.stringify(itensMap));

			mountainBikes.forEach(function (modelo) {
				const prodCard = document.createElement("div");

				let categorias = modelo.categorias;
				if (typeof categorias === "string") {
					categorias = categorias.split(/\s+/);
				}

				prodCard.classList.add("prod-card");
				categorias.forEach((categoria) => {
					if (typeof categoria === "string" && categoria.trim()) {
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
				prodAdd.setAttribute("onclick", "addCarrinho(this)"); // Adiciona o ID ao atributo data-id
				prodAdd.setAttribute("data-id", modelo.id); // Adiciona o ID ao atributo data-id
				prodAdd.innerHTML = "Adicionar ao carrinho";

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
			console.error("Erro ao carregar os dados das bicicletas:", err);
		});

	atualizarCarrinho();
	atualizarValorTotal();
});

function addCarrinho(button) {
	// Obtém o ID do item do atributo data-id do botão clicado
	const itemId = button.getAttribute("data-id");

	// Recupera o mapa de itens do localStorage
	const itensMap = JSON.parse(localStorage.getItem("itensMap")) || {};

	// Recupera o carrinho do localStorage ou cria um novo
	let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

	// Verifica se o item está presente no itensMap
	let bicicleta = itensMap[itemId];

	const bicicletaIndex = carrinho.findIndex((item) => item.id == itemId);

	if (bicicletaIndex === -1) {
		// Adiciona o item ao carrinho
		carrinho.push(bicicleta);
		// Atualiza o carrinho
		localStorage.setItem("carrinho", JSON.stringify(carrinho));
	} else {
		carrinho[bicicletaIndex] = bicicleta;
	}

	button.style.backgroundColor = "green";
	button.innerHTML = "✔ Adicionado";

	setTimeout(() => {
		button.style.backgroundColor = ""; // Restaura a cor original
		button.innerHTML = "Adicionar ao carrinho"; // Restaura o texto original
	}, 1200);

	atualizarCarrinho();
	atualizarValorTotal();
}

function atualizarCarrinho() {
	let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

	const contador = document.querySelectorAll("#contador");
	const mobileCarrinhoContent = document.querySelector(
		".mobile-carrinho-content"
	);
	const carrinhoContent = document.querySelector(".carrinho-content");

	carrinhoContent.innerHTML = "";
	mobileCarrinhoContent.innerHTML = "";

	if (carrinho.length == 0 || carrinho == undefined) {
		contador.forEach((cont) => {
			cont.innerHTML = "0";
		});
		carrinhoContent.innerHTML = "";
	} else {
		contador.forEach((cont) => {
			cont.innerHTML = carrinho.length;
		});
	}

	carrinho.forEach((bicicleta) => {
		const carProduto = document.createElement("li");
		carProduto.classList.add("car-produto");
		carProduto.setAttribute("data-id", bicicleta.id);

		const carImg = document.createElement("img");
		carImg.classList.add("prod-img");
		carImg.setAttribute("src", bicicleta.imagem);

		const carNome = document.createElement("p");
		carNome.classList.add("prod-nome");
		carNome.innerHTML = bicicleta.nomeAbrev;

		const carValor = document.createElement("p");
		carValor.classList.add("prod-valor");
		carValor.innerHTML = bicicleta.valor;

		const qty = document.createElement("input");
		qty.setAttribute("type", "number");
		qty.setAttribute("id", "quantidade");
		qty.setAttribute("value", bicicleta.qty || "1");
		qty.addEventListener("change", () =>
			atualizarQuantidade(bicicleta.id, qty.value)
		);

		const removeButton = document.createElement("button");
		removeButton.setAttribute("data-id", bicicleta.id);
		removeButton.setAttribute("id", "remove");
		removeButton.addEventListener("click", function () {
			removeItem(this.getAttribute("data-id"));
		});
		removeButton.innerHTML =
			'<svg class="remove" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M267.33-120q-27.5 0-47.08-19.58-19.58-19.59-19.58-47.09V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-328 469.33h66.66v-386h-66.66v386Zm164 0h66.66v-386h-66.66v386ZM267.33-740v553.33V-740Z"/></svg>';

		carProduto.appendChild(carImg);
		carProduto.appendChild(carNome);
		carProduto.appendChild(carValor);
		carProduto.appendChild(qty);
		carProduto.appendChild(removeButton);

		const carProdutoClone = carProduto.cloneNode(true);
		carProdutoClone
			.querySelector("button#remove")
			.addEventListener("click", function () {
				removeItem(this.getAttribute("data-id"));
			});
		mobileCarrinhoContent.appendChild(carProdutoClone);

		mobileCarrinhoContent.appendChild(carProdutoClone);
		carrinhoContent.appendChild(carProduto);

		atualizarValorTotal();
	});
}

function atualizarQuantidade(itemID, quantidade) {
	let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

	carrinho = carrinho.map((item) => {
		if (item.id === itemID) {
			item.qty = parseInt(quantidade, 10);
		}
		return item;
	});

	localStorage.setItem("carrinho", JSON.stringify(carrinho));
	atualizarCarrinho();
	atualizarValorTotal();
}

function clearCarrinho() {
	localStorage.removeItem("carrinho");

	const contador = document.querySelectorAll("#contador");

	contador.forEach((cont) => {
		cont.innerHTML = "0";
	});

	atualizarCarrinho();
	atualizarValorTotal();
}

function removeItem(itemID) {
	let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

	carrinho = carrinho.filter((item) => item.id !== itemID);

	localStorage.setItem("carrinho", JSON.stringify(carrinho));

	atualizarCarrinho();
	atualizarValorTotal();
}
