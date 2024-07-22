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

function filtrarProdutos() {
	const categoriasVerificadas = document.querySelectorAll(
		".prod-checkbox:checked"
	);
	const categoriasSelecionadas = Array.from(categoriasVerificadas).map(
		(checkbox) => checkbox.id
	);

	const prodCard = document.querySelectorAll(".prod-card");
	prodCard.forEach((produto) => {
		const categoriasProduto = produto.getAttribute("data-categoria").split(", ");
		const exibirProduto = categoriasSelecionadas.every((categoria) =>
			categoriasProduto.includes(categoria)
		);
		produto.style.display = exibirProduto ? "flex" : "none";
	});
}

const checkboxes = document.querySelectorAll(".prod-checkbox");

checkboxes.forEach((checkbox) => {
	checkbox.addEventListener("change", filtrarProdutos);
});

// Função para ordenar produtos
function ordenarProdutos(criterio) {
	const container = document.getElementById("bicicletas");
	let produtos = Array.from(container.getElementsByClassName("prod-card"));

	produtos.sort((a, b) => {
		const valorA = parseFloat(
			a
				.querySelector(".produto-valor")
				.innerText.replace("R$ ", "")
				.replace(".", "")
				.replace(",", ".")
		);
		const valorB = parseFloat(
			b
				.querySelector(".produto-valor")
				.innerText.replace("R$ ", "")
				.replace(".", "")
				.replace(",", ".")
		);

		const nomeA = a.querySelector(".produto-nome").innerText.toLowerCase();
		const nomeB = b.querySelector(".produto-nome").innerText.toLowerCase();

		switch (criterio) {
			case "alfabetico":
				return nomeA.localeCompare(nomeB);
			case "preco-asc":
				return valorA - valorB;
			case "preco-desc":
				return valorB - valorA;
			default:
				return 0;
		}
	});

	// Limpa o container e adiciona os produtos ordenados
	container.innerHTML = "";
	produtos.forEach((produto) => container.appendChild(produto));
}

// Adiciona um listener para o select de ordenação
document.getElementById("ordenar").addEventListener("change", (event) => {
	const criterio = event.target.value;
	ordenarProdutos(criterio);
});

window.addEventListener("DOMContentLoaded", () => {
	fetch("js/json/bicicletas.json")
		.then((response) => response.json())
		.then((items) => {
			let bicicletas = items.bicicletas;

			const container = document.getElementById("bicicletas");

			// Armazena os itens em um mapa para acesso rápido
			const itensMap = {};
			bicicletas.forEach((modelo) => {
				itensMap[modelo.id] = modelo; // Supondo que cada modelo tem um campo id único
			});

			// Salva o mapa de itens no localStorage
			localStorage.setItem("itensMap", JSON.stringify(itensMap));

			bicicletas.forEach(function (modelo) {
				const prodCard = document.createElement("div");

				let categorias = modelo.categorias;

				// Função para extrair categorias de um objeto ou array
				function extrairCategorias(categorias) {
					let categoriasValidas = [];

					categorias.forEach((categoria) => {
						if (typeof categoria === "string" && categoria.trim()) {
							categoriasValidas.push(categoria.trim());
						} else if (typeof categoria === "object" && categoria !== null) {
							// Se a categoria for um objeto ou array, percorra suas propriedades
							for (let key in categoria) {
								if (Array.isArray(categoria[key])) {
									categoriasValidas = categoriasValidas.concat(
										extrairCategorias(categoria[key])
									);
								} else if (
									typeof categoria[key] === "string" &&
									categoria[key].trim()
								) {
									categoriasValidas.push(categoria[key].trim());
								}
							}
						}
					});

					return categoriasValidas;
				}

				// Extrair categorias válidas
				let categoriasValidas = extrairCategorias(categorias);

				prodCard.classList.add("prod-card");

				// Definir o atributo data-categoria com as categorias concatenadas
				if (categoriasValidas.length > 0) {
					prodCard.setAttribute("data-categoria", categoriasValidas.join(", "));
				}

				const prodCardURL = document.createElement("a");
				prodCardURL.classList.add("prod-card-container");
				prodCardURL.setAttribute("href", modelo.url);
				prodCardURL.setAttribute("target", "_blank");

				const prodImgContainer = document.createElement("figure");
				prodImgContainer.classList.add("produto-figure");

				const prodImg = document.createElement("img");
				prodImg.classList.add("produto");
				prodImg.setAttribute("src", modelo.imagem);

				prodImgContainer.appendChild(prodImg);

				const prodMarca = document.createElement("p");
				prodMarca.classList.add("produto-marca");
				prodMarca.innerHTML = modelo.marca;

				const prodNome = document.createElement("p");
				prodNome.classList.add("produto-nome");
				prodNome.innerHTML = modelo.nomeAbrev;

				const prodValor = document.createElement("p");
				prodValor.classList.add("produto-valor");
				prodValor.innerHTML = modelo.valor;

				const prodAdd = document.createElement("button");
				prodAdd.classList.add("adicionar");
				prodAdd.setAttribute("onclick", "addCarrinho(this)"); // Adiciona o ID ao atributo data-id
				prodAdd.setAttribute("data-id", modelo.id); // Adiciona o ID ao atributo data-id
				prodAdd.innerHTML = "&#43;";

				const prodDesc = document.createElement("p");
				prodDesc.classList.add("produto-desc");
				prodDesc.innerHTML = modelo.desc;

				prodCardURL.appendChild(prodImgContainer);
				prodCardURL.appendChild(prodMarca);
				prodCardURL.appendChild(prodNome);
				prodCardURL.appendChild(prodValor);
				prodCard.appendChild(prodAdd);
				prodCardURL.appendChild(prodDesc);
				prodCard.appendChild(prodCardURL);

				container.appendChild(prodCard);
			});
		})
		.catch((err) => {
			console.error("Erro ao carregar os dados das bicicletas:", err);
		});

	ordenarProdutos("alfabetico");
	atualizarCarrinho();
	atualizarValorTotal();
	renderizarBicicletasAleatorias();
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

	button.innerHTML = "";
	setTimeout(() => {
		button.innerHTML = "✔ Adicionado ao Carrinho";
	}, 200);
	button.style.cssText =
		"background-color: green; width: 80%; border-radius: 15px; transition: border-radius 400ms, width 300ms;";

	setTimeout(() => {
		button.style.cssText =
			"width: 40px; border-radius: none; transition: width 300ms, border-radius 400ms, background-color: 400ms;";
		button.innerHTML = "&#43;";
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

		const carMarca = document.createElement("p");
		carMarca.classList.add("prod-marca");
		carMarca.innerHTML = bicicleta.marca;

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
		carProduto.appendChild(carMarca);
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
