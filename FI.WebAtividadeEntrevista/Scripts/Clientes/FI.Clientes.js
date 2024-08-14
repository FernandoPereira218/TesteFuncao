var beneficiarios = [];
var posicaoEditar = -1;
$(document).ready(function () {
    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        if (!TestaDigitoVerificadorCPF($(this).find("#CPF").val())) {
            alert("CPF inválido!");
            return;
        }

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val(),
                "Beneficiarios": beneficiarios
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    ModalDialog("Sucesso!", r)
                    $("#formCadastro")[0].reset();
                }
        });
    });

    $(".CPF").mask('###.###.###-##');

    $("#tabelaBeneficiarios").hide();
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

/**
 * Fonte: https://www.devmedia.com.br/validar-cpf-com-javascript/23916
 * @param {any} strCPF String de CPF
 * @returns
 */
function TestaDigitoVerificadorCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF == "00000000000") return false;

    strCPF = strCPF.replaceAll(".", '').replaceAll("-", "");

    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
}

/**
 * Verificar se já há um CPF igual adicionado na lista
 * @param {any} strCPF
 * @param {any} posicao
 * @returns True se for duplicado, false se não for
 */
function TesteCPFBeneficiarioDuplicado(strCPF, posicao) {
    if (posicao) { //se tem posição, é por ser uma edição
        return beneficiarios.some((x, i) => x.CPF.replaceAll(".", '').replaceAll("-", "") === strCPF.replaceAll(".", '').replaceAll("-", "") && i !== posicao);
    } else { //Se não, é uma adição, então é só conferir no array inteiro
        return beneficiarios.some(x => x.CPF.replaceAll(".", '').replaceAll("-", "") === strCPF.replaceAll(".", '').replaceAll("-", ""));
    }
}

function ModalBeneficiarios() {
    $("#modalBeneficiarios").modal('show');
}

function AtualizarListaBeneficiarios(lista) {
    $("#listaBeneficiarios").html("");
    var textoFinal = '';
    lista.forEach((obj, index) => {
        var texto = '<tr>                                           ' +
            '            <td id="beneficiario_' + index + '_CPF">' + obj.CPF + '</td>                      ' +
            '            <td id="beneficiario_' + index + '_Nome">' + obj.Nome + '</td>                     ' +
            '            <td>' +
            '               <div>' +
            '                   <button type="button" class="btn btn-primary btn-md" onclick="AlterarBeneficiario(' + index + ');">Alterar</button > ' +
            '                   <button type="button" class="btn btn-primary btn-md" onclick="RemoverBeneficiario(' + index + ');">Excluir</button>   ' +
            '                </div >' +
            '            </td> ' +
            '        </tr>';

        textoFinal += texto;
    });

    $("#listaBeneficiarios").append(textoFinal);

    if (lista.length === 0) {
        $("#tabelaBeneficiarios").hide();
    } else {
        $("#tabelaBeneficiarios").show();
    }
}

function AlterarTelaEdicao(editar = false) {
    if (editar) {
        $("#divIncluir").hide();
        $("#divAlterar").show();
    } else {
        $("#divIncluir").show();
        $("#divAlterar").hide();
    }
}

function IncluirBeneficiario() {
    
    var beneficiario = {
        CPF: $("#CPFBeneficiario").val(),
        Nome: $("#NomeBeneficiario").val(),
    };

    if (!beneficiario.Nome) {
        alert("O nome é obrigatório");
        return;
    }

    if (!TestaDigitoVerificadorCPF(beneficiario.CPF)) {
        alert("O CPF não é válido!");
        return;
    }

    if (TesteCPFBeneficiarioDuplicado(beneficiario.CPF)) {
        alert("Este cliente já possui um beneficiário com este CPF");
        return;
    }

    $("#CPFBeneficiario").val("");
    $("#NomeBeneficiario").val("");

    beneficiarios.push(beneficiario);

    AtualizarListaBeneficiarios(beneficiarios);
}

function AlterarBeneficiario(posicao) {
    AlterarTelaEdicao(true);
    var beneficiario = beneficiarios.filter((x, i) => i === posicao)[0];
    $("#CPFBeneficiario").val(beneficiario.CPF);
    $("#NomeBeneficiario").val(beneficiario.Nome);
    posicaoEditar = posicao;
}

function RemoverBeneficiario(posicao) {
    beneficiarios = beneficiarios.filter((x, i) => i !== posicao);
    AtualizarListaBeneficiarios(beneficiarios);
}

function EditarBeneficiario() {
    var beneficiarioEdicao = {
        CPF: $("#CPFBeneficiario").val(),
        Nome: $("#NomeBeneficiario").val(),
    };

    if (!beneficiarioEdicao.Nome) {
        alert("O nome é obrigatório");
        return;
    }

    if (!TestaDigitoVerificadorCPF(beneficiarioEdicao.CPF)) {
        alert("O CPF não é válido!");
        return;
    }

    if (TesteCPFBeneficiarioDuplicado(beneficiarioEdicao.CPF, posicaoEditar)) {
        alert("Este cliente já possui um beneficiário com este CPF");
        return;
    }

    beneficiarios = beneficiarios.map((x, i) => {
        if (i !== posicaoEditar) return x;
        return {
            ...beneficiarioEdicao
        };
    });

    $("#CPFBeneficiario").val("");
    $("#NomeBeneficiario").val("");

    AlterarTelaEdicao(false);

    AtualizarListaBeneficiarios(beneficiarios);
}

function CancelarEdicao() {
    AlterarTelaEdicao(false);

    $("#CPFBeneficiario").val("");
    $("#NomeBeneficiario").val("");
}