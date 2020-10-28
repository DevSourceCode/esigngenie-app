import React, { Component } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import jQuery from "../../node_modules/jquery/dist/jquery";
import Recipient from "../Recipient/Recipient";
import RecipientParent from "../Recipient/RecipientParent";
import { Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import "../Document/Document.css";
import Iframe from "react-iframe";
import Alert from "react-bootstrap/Alert";
class Document extends Component {
  constructor() {
    super();

    if (
      localStorage.getItem("loggedIn") == null ||
      !localStorage.getItem("loggedIn")
    ) {
      window.location.pathname = "/";
    }
    this.ClientId = "ede726e0381d42f585012a3f9a33b171";
    this.ClientSecret = "edc68ede46da43078d15d0a71ac630e1";
    this.OAuthUrl = "https://www.esigngenie.com/esign/api/oauth2/access_token";
    this.CreateFolder =
      "https://www.esigngenie.com/esign/api/folders/createfolder/";
    this.EmbeddedSessionURL = "";
    this.uploadDocument = this.uploadDocument.bind(this);
    this.generateAccessToken = this.generateAccessToken.bind(this);
    this.uploadSuccess = this.uploadSuccess.bind(this);
    this.resizeIframe = this.resizeIframe.bind(this);
    this.recipientsSigningURLs = [];
    this.recipientSigningURL = "";
    this.ErrorDescription = "";
    this.SuccessDescription = "";
    this.generateAccessToken();
  }
  state = {
    numChildren: 1,
    showDraftDocument: false,
    showSignFrame: false,
    showRecipientLinks: false,
    showError: false,
    showSuccess: false
  };
  onAddChild = () => {
    this.setState({
      numChildren: this.state.numChildren + 1,
    });
  };

  generateAccessToken = () => {
    jQuery.ajax({
      url: this.OAuthUrl,
      method: "POST",
      dataType: "json",
      data:
        "grant_type=client_credentials&client_id=" +
        this.ClientId +
        "&client_secret=" +
        this.ClientSecret +
        "&scope=read-write",
      cache: false,
      success: function (data) {
        localStorage.setItem("access_token", data.access_token);
      },
      error: function (xhr, status, err) {
        console.log("Failed");
      },
    });
  };

  uploadSuccess = (data, event) => {
    debugger;
    if (data.result === "success") {
      if (event.target.id === "sendNowDoc") {
        for (let i = 0; i < data.embeddedSigningSessions.length; i++) {
          this.recipientsSigningURLs.push({
            emailIdOfSigner: data.embeddedSigningSessions[i].emailIdOfSigner,
            embeddedSessionURL:
              data.embeddedSigningSessions[i].embeddedSessionURL,
          });
        }
        this.setState({ showRecipientLinks: true });
      } else {
        if(event.target.id === 'uploadDoc'){
            this.SuccessDescription = 'Document Uploaded Successfully.';
            this.setState({ showSuccess: true });
        }
        else{
          this.SuccessDescription = 'Document Uploaded Successfully. Please wait loading document...';
          this.setState({ showSuccess: true });
          this.EmbeddedSessionURL = data.embeddedSessionURL;
          this.setState({ showDraftDocument: true });
        }   
      }
      this.setState({ numChildren: 1 });
      jQuery("input#templateId").val('');
      jQuery("input#document").val('');
      jQuery("div.recipientInfo").children().val('');
    } 
    else {
      this.ErrorDescription = data.error_description;
      this.setState({ showError: true });
    }
  };

  uploadDocument = (event) => {
    this.setState({ showSuccess: false });
    this.setState({ showError: false });

    this.setState({ showDraftDocument: false });
    this.setState({ showSignFrame: false });
    this.setState({ showRecipientLinks: false });


    let formData = new FormData();
    let recipients = [];
    let recipientInfo = jQuery("div.recipientInfo").children();
    for (let i = 0; i < recipientInfo.length; i++) {
      let name = jQuery(recipientInfo[i]).children("input[type=text]").val();
      let email = jQuery(recipientInfo[i]).children("input[type=email]").val();
      if(name !== '' || email !== ''){
        recipients.push({ name: name, email: email });
      }
    }
    let templateId = jQuery("input#templateId").val();
    let document = jQuery("input#document").prop("files");
    if(document == null || document == 'undefined' || document.length === 0)
    {
      this.ErrorDescription = "No file selected";
      this.setState({ showError: true });
      return false;
    }
    let data = {
      folderName: document[0].name,
      processTextTags: true,
      processAcroFields: true,
      signInSequence: false,
      sendNow: event.target.id === "sendNowDoc" ? true : false,
      createEmbeddedSendingSession:
        event.target.id === "sendNowDoc" ? false : true,
      fixRecipientParties: true,
      fixDocuments: true,
      sendSuccessUrl: "https://www.google.com/",
      sendErrorUrl: "https://www.google.com/",
      createEmbeddedSigningSession:
        event.target.id === "sendNowDoc" ? true : false,
      createEmbeddedSigningSessionForAllParties:
        event.target.id === "sendNowDoc" ? true : false,
      signSuccessUrl: "https://www.google.com/",
      signDeclineUrl: "https://www.google.com/",
      signLaterUrl: "https://www.google.com/",
      signErrorUrl: "https://www.google.com/",
      applyTemplate: true,
      templateIds: [templateId],
      parties: [],
    };
    for (let i = 0; i < recipients.length; i++) {
      data.parties.push({
        firstName: recipients[i].name,
        lastName: recipients[i].name,
        emailId: recipients[i].email,
        permission: "FILL_FIELDS_AND_SIGN",
        workflowSequence: 1,
        sequence: i + 1,
      });
    }
    formData.append("data", JSON.stringify(data));
    formData.append("file", document[0]);
    event.persist();
    jQuery.ajax({
      url:
        this.CreateFolder +
        "?access_token=" +
        localStorage.getItem("access_token"),
      data: formData,
      processData: false,
      contentType: false,
      dataType: "json",
      method: "POST",
      success: (data) => {
        this.uploadSuccess(data, event);
      },
      error: (xhr, status, err) => {
        this.ErrorDescription = err;
        this.setState({ showError: false });

      },
    });
  };

  resizeIframe = (event) => {
    debugger;
    let iframe = jQuery("Iframe#draftDocFrame")[0];
    iframe.height = iframe.contentWindow.document.body.scrollHeight + "px";
  };

  showSigningFrame = (event) => {
    debugger;
    let recipient = event.target.id;
    for (let i = 0; i < this.recipientsSigningURLs.length; i += 1) {
      if (this.recipientsSigningURLs[i].emailIdOfSigner === recipient) {
        this.recipientSigningURL = this.recipientsSigningURLs[i].embeddedSessionURL;
      }
    }
    this.setState({ showSignFrame: true });
  };
  render() {
    const children = [];
    for (let i = 0; i < this.state.numChildren; i += 1) {
      children.push(<Recipient />);
    }

    const recipientsSignURLs = [];
    for (let i = 0; i < this.recipientsSigningURLs.length; i += 1) {
      debugger;
      recipientsSignURLs.push(
        <Button
          onClick={(event) => this.showSigningFrame(event)}
          key={i}
          id={this.recipientsSigningURLs[i].emailIdOfSigner}>
          {this.recipientsSigningURLs[i].emailIdOfSigner}
        </Button>
      );
    }
    return (
      <div className="jumbotron d-flex align-items-center">
        <Container>
          {this.state.showError ? 
            <Alert variant="danger">{this.ErrorDescription}</Alert>
           : null}

          {this.state.showSuccess ? 
            <Alert variant="primary">{this.SuccessDescription}</Alert>
           : null}
          <Row>
            <div className="form-group">
              <input
                type="file"
                className="form-control-file"
                id="document"
                accept="application/pdf"
              />
            </div>
          </Row>
          <br/>
          <Row>
            <div className="form-group">
              <label htmlFor="templateId">Template Id</label>
              <input
                type="text"
                className="form-control-file"
                id="templateId"
              />
            </div>
          </Row>
          <br/>
          <Row>
            <RecipientParent addChild={this.onAddChild}>
              {children}
            </RecipientParent>
          </Row>
          <br></br>
          <Row>
            <Button onClick={this.uploadDocument} id="uploadDoc">
              Upload Document
            </Button>
          </Row>
          <br/>
          <Row>
            <Button onClick={this.uploadDocument} id="draftDoc">
              Open Draft Document
            </Button>
          </Row>
          <br/>
          <Row>
            <div style={{ height: "100%", width: "100%", overflow: "auto" }}>
              {this.state.showDraftDocument ? (
                <Iframe
                  url={this.EmbeddedSessionURL}
                  width="100%"
                  id="draftDocFrame"
                  display="block"
                  position="relative"
                  height="640px"
                  allow="fullscreen"
                  styles={{border: "2px solid"}}
                />
              ) : null}
            </div>
          </Row>
          <Row>
            <Button onClick={this.uploadDocument} id="sendNowDoc">
              Send Document Now
            </Button>
          </Row>
          <br/>
          <Row>{this.state.showRecipientLinks ? recipientsSignURLs : null}</Row>
          <br/>
          <Row>
            <div style={{ height: "100%", width: "100%", overflow: "auto" }}>
              {this.state.showSignFrame ? (
                <Iframe
                  url={this.recipientSigningURL}
                  width="100%"
                  id="signDocFrame"
                  display="block"
                  position="relative"
                  height="640px"
                  allow="fullscreen"
                  styles={{border: "2px solid"}}
                />
              ) : null}
            </div>
          </Row>
        </Container>
      </div>
    );
  }
}
export default Document;
