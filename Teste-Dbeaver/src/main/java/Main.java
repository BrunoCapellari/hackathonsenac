
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.Scanner;

public class Main {

    private static final String URL =
            "jdbc:postgresql://localhost:5432/postgres";

    private static final String USER = "postgres";

    // Busca a senha nas variáveis de ambiente do sistema.
    private static final String PASSWORD =
            System.getenv("DB_PASSWORD");

    public static void main(String[] args) {

        if (PASSWORD == null || PASSWORD.isBlank()) {
            System.out.println(
                    "Erro: variável de ambiente DB_PASSWORD não configurada."
            );
            return;
        }

        Scanner scanner = new Scanner(System.in);

        System.out.println("=== CADASTRO DE USUÁRIO ===");

        System.out.print("Nome: ");
        String nome = scanner.nextLine();

        System.out.print("E-mail: ");
        String email = scanner.nextLine();

        System.out.print("Senha: ");
        String senha = scanner.nextLine();

        String sql = """
                INSERT INTO usuarios (nome, email, senha_hash)
                VALUES (?, ?, ?)
                """;

        try (Connection conexao =
                     DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement statement =
                     conexao.prepareStatement(sql)) {

            statement.setString(1, nome);
            statement.setString(2, email);

            // Gera um hash seguro da senha utilizando BCrypt.
            String senhaHash = org.mindrot.jbcrypt.BCrypt.hashpw(
                    senha,
                    org.mindrot.jbcrypt.BCrypt.gensalt()
            );

            statement.setString(3, senhaHash);

            statement.executeUpdate();

            System.out.println("\nUsuário cadastrado com sucesso!");

        } catch (Exception e) {
            System.out.println("\nErro ao cadastrar usuário:");
            System.out.println(e.getMessage());
        }

        scanner.close();
    }
}
