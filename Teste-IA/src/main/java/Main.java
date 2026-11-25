
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        List<String> historico = new ArrayList<>();

        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();

        String url = "http://localhost:11434/api/chat";

        System.out.println("================================");
        System.out.println("       ASSISTENTE IA LOCAL");
        System.out.println("================================");
        System.out.println("Modelo: Qwen 2.5 3B");
        System.out.println("Digite 'sair' para encerrar.");
        System.out.println();

        while (true) {

            System.out.print("Você: ");
            String pergunta = scanner.nextLine();

            if (pergunta.equalsIgnoreCase("sair")) {
                System.out.println("\nEncerrando o assistente...");
                break;
            }

            if (pergunta.isBlank()) {
                continue;
            }

            historico.add(
                    "{\"role\":\"user\",\"content\":\""
                    + escaparJson(pergunta) + "\"}"
            );

            String mensagens = String.join(",", historico);

            String json = """
                {
                    "model": "qwen2.5:3b",
                    "messages": [%s],
                    "stream": false
                }
                """.formatted(mensagens);

            try {

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .timeout(Duration.ofSeconds(180))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(json))
                        .build();

                System.out.println("\nIA pensando...");

                HttpResponse<String> response = client.send(
                        request,
                        HttpResponse.BodyHandlers.ofString()
                );

                if (response.statusCode() != 200) {
                    System.out.println("Erro HTTP: " + response.statusCode());
                    System.out.println(response.body());
                    historico.remove(historico.size() - 1);
                    continue;
                }

                String resposta = extrairResposta(response.body());

                historico.add(
                        "{\"role\":\"assistant\",\"content\":\""
                        + escaparJson(resposta) + "\"}"
                );

                System.out.println("\nIA: " + resposta);
                System.out.println();

            } catch (Exception e) {

                System.out.println("\nErro ao conectar com a IA:");
                System.out.println(e.getMessage());

                historico.remove(historico.size() - 1);
            }
        }

        scanner.close();
    }

    private static String escaparJson(String texto) {

        return texto
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    private static String extrairResposta(String json) {

        String marcador = "\"content\":\"";
        int inicio = json.indexOf(marcador);

        if (inicio == -1) {
            return "Não foi possível encontrar a resposta da IA.";
        }

        inicio += marcador.length();

        StringBuilder resultado = new StringBuilder();
        boolean escape = false;

        for (int i = inicio; i < json.length(); i++) {

            char c = json.charAt(i);

            if (escape) {

                switch (c) {
                    case 'n' -> resultado.append('\n');
                    case 'r' -> resultado.append('\r');
                    case 't' -> resultado.append('\t');
                    case '"' -> resultado.append('"');
                    case '\\' -> resultado.append('\\');
                    case '/' -> resultado.append('/');
                    default -> resultado.append(c);
                }

                escape = false;

            } else if (c == '\\') {

                escape = true;

            } else if (c == '"') {

                break;

            } else {

                resultado.append(c);
            }
        }

        return resultado.toString();
    }
}
