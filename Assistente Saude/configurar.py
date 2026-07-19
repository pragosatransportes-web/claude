"""
Pergunta as credenciais Garmin e escreve o .env.

Corre na tua maquina. A password nao aparece no ecra e nao e mostrada
a mais ninguem — vai direta do teclado para o ficheiro .env local.
"""

import getpass
from pathlib import Path

BASE = Path(__file__).parent
ENV = BASE / ".env"


def main():
    print()
    print("  Configuracao das credenciais Garmin Connect")
    print("  " + "-" * 42)
    print()

    email = input("  Email do Garmin Connect: ").strip()
    if not email or "@" not in email:
        print("\n  ERRO: email invalido. Volta a correr este ficheiro.\n")
        return

    print()
    print("  Password (nao vai aparecer nada enquanto escreves — e normal)")
    pw = getpass.getpass("  Password: ").strip()
    if not pw:
        print("\n  ERRO: password vazia. Volta a correr este ficheiro.\n")
        return

    pw2 = getpass.getpass("  Repete a password: ").strip()
    if pw != pw2:
        print("\n  ERRO: as passwords nao coincidem. Volta a correr este ficheiro.\n")
        return

    ENV.write_text(
        f"GARMIN_EMAIL={email}\nGARMIN_PASSWORD={pw}\n",
        encoding="utf-8",
    )

    print()
    print(f"  OK — credenciais gravadas em {ENV.name}")
    print(f"  Email: {email}")
    print(f"  Password: {'*' * len(pw)} ({len(pw)} caracteres)")
    print()
    print("  Podes agora correr o sync.bat")
    print()


if __name__ == "__main__":
    main()
