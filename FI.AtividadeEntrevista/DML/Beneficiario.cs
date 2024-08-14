using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.DML
{
    /// <summary>
    /// Classe de beneficiario que representa o registo na tabela Beneficiario do Banco de Dados
    /// </summary>
    public class Beneficiario
    {
        /// <summary>
        /// Id
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// Nome
        /// </summary>
        public string Nome { get; set; }

        /// <summary>
        /// CPF
        /// </summary>
        public string CPF { get; set; }

        /// <summary>
        /// IdCliente
        /// </summary>
        public long IdCliente { get; set; }

        [NotMapped]
        public string DisplayCPF
        {
            get
            {
                if (!string.IsNullOrEmpty(CPF))
                {
                    if (CPF.Length == 11)
                        return $"{CPF.Substring(0, 3)}.{CPF.Substring(3, 3)}.{CPF.Substring(6, 3)}-{CPF.Substring(9, 2)}";
                    else if (CPF.Length > 11)
                        return CPF;
                }

                return string.Empty;
            }
        }
    }
}
