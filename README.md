# To Do List - Next.js (Em desenvolvimento)
---
## Descrição do projeto 
Esse projeto é um marco zero pra mim, porque é o primeiro projeto pessoal e real que envolve o desenvolvimento tanto do front-end como do back-end. 
Ele é desenvolvido em Next.js e a lógica do back-end está desenvolvida na pasta *pages/api* que o Next.js fornece para criar rotas de API. Todo o sistema é planejado com React para o front-end e JavaScript para o back-end.

A escolha de usar Next.js foi feita por ser uma framework da linguagem JavaScript e que utiliza React, uma bibilioteca que eu estudo desde _dezembro/2024_.
A lógica é que o usuário crie a sua conta através do site, usando um nome de usuário(podendo ser o próprio nome) e o e-mail que será único em toda a aplicação.

## Tecnologias usadas 
O foco não é explicar qual a função de cada uma com muito detalhe, mas sim listar o que contém nesse projeto

Nome | Tipo |função no projeto 
--- | --- | ---
HTML | Linguagem de marcação de texto | Estrutura do site para indicar as partes semântica, é como o "esqueleto" da página web
CSS |  Folhas de estilo  |Estilização de todo o conteúdo visível e as interações da página web
Bootstrap | Framework |  framework front-end que facilita a criação de sites e aplicações web, oferecendo um conjunto de estilos prontos, componentes e um sistema de layout baseado em grades responsivas.
JavaScript | Linguagem de programação| Linguagem principal com maior importância no projeto, presente desde o framework, Next.js, até a lógica das rotas no back-end
Next.js | Framework | Facilitador e otimizador do desenvolvimento, abrangendo tanto o front-end quanto o back-end da aplicação
React | Bibilioteca de JavaScript | Cria interfaces de usuário dinâmicas e interativas de forma eficiente e escalável. Ele permite construir componentes reutilizáveis, otimizar o desempenho da aplicação e facilitar a manutenção do código.
Axios |Biblioteca de JavaScript| Facilita a realização de requisições HTTP a partir do navegador
Bcrypt | Biblioteca | É uma função de hash de senha amplamente utilizada e considerada uma das mais seguras disponíveis. Ela é projetada para proteger senhas de usuários, transformando-as em sequências de caracteres aleatórias e irreversíveis, conhecidas como "hashes".
JSON Web Token | Biblioteca | Ferramenta poderosa para autenticação e autorização em aplicações web e móveis. 
Cookies | Biblioteca | Permite ler, escrever e assinar cookies de forma segura em aplicações back-end. Nessa aplicação está agilizando o processo de autenticação com token

## Estrutura do projeto

### Front-end

## Front-end  

O front-end do projeto foi desenvolvido utilizando **Next.js**, garantindo uma experiência otimizada com renderização híbrida e performance aprimorada.  

### Tecnologias e Funcionalidades  

| Tecnologia | Descrição |
|------------|-----------|
| **Next.js** | Framework baseado em React que permite criação de páginas dinâmicas e server-side rendering. |
| **useRouter** | Hook do Next.js utilizado para gerenciar a navegação entre as páginas do sistema. |
| **Autenticação de Usuário** | O acesso ao sistema é protegido, garantindo que cada usuário possa visualizar e gerenciar apenas suas próprias tarefas. |
| **Next API Routes** | A comunicação com o back-end é feita por meio das rotas de API do Next.js, possibilitando operações como login, cadastro e gerenciamento de tarefas. |

### Cadastro e Login  

Para acessar o sistema, o usuário precisa preencher o **formulário de cadastro**, informando:  
- **E-mail único**  
- **Nome de usuário**  
- **Senha segura**  

Após o cadastro, ele será **redirecionado para a página de login**, onde precisará autenticar suas credenciais antes de realizar qualquer ação no sistema.  

O projeto foi estruturado para proporcionar uma interface intuitiva e segura, garantindo que os usuários possam gerenciar suas tarefas de forma eficiente.  


### Back-end

O back-end dessa aplicação foi criada dentro da pasta _/pages/api_ já que o Next.js permite essa facilidade. 
Toda a estrutura de rotas segue o padrão API RESTful onde todas as ações em relação a usuários estão na rota __/users__ enquanto a de tarefas na rota __/tasks__.

O banco de dados utilizado nesse projeto é o MongoDb Atlas.

As rotas estão centralizadas em arquivos separados seguindo a lógica de estrutura do Next.js.
A api está com divisões para models e controllers
models | controllers
-- | --
Recebe os arquivos Users.js e Tasks.jsque instanciam como os usuários e as tarefas devem ser criados respectivamente | Recebe os arquivos userController.js e tasksController.js que recebem todos os metódos acionados com cada tipo de requisição HTTP

__Esse projeto segue em desenvolvimento enquanto você lê esse Readme__
