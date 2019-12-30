import React from 'react';
import './style.scss';

import {
  apply,
  getApplication,
  getRoles,
  uploadResume,
} from 'api';

import { Field, Form, Formik } from 'formik';

import BackButton from 'components/BackButton';
import Loading from 'components/Loading';
import Message from 'components/Message';
import NextButton from 'components/NextButton';
import SelectField from 'components/SelectField';
import SubmitButton from 'components/SubmitButton';

import pinFilled from 'assets/apply/pin_filled.svg';
import pinEmpty from 'assets/apply/pin_empty.svg';

import {
  graduationYears,
  languages,
  schools,
} from './lists';

const customStyles = {
  control: () => ({
    background: 'transparent',
    borderBottom: '2px solid #0A093F',
    display: 'flex',
  }),
  placeholder: base => ({
    ...base,
    color: 'rgba(164, 59, 92, 0.5)',
    fontWeight: 600,
  }),
  input: base => ({
    ...base,
    color: 'rgb(164, 59, 92)',
    fontWeight: 600,
  }),
  singleValue: base => ({
    ...base,
    color: 'rgb(164, 59, 92)',
    fontWeight: 600,
  }),
  multiValue: base => ({
    ...base,
    border: '1px solid #A43B5C',
    background: 'transparent',
  }),
  multiValueLabel: base => ({
    ...base,
    color: '#A43B5C',
  }),
  multiValueRemove: base => ({
    ...base,
    color: '#A43B5C',
  }),
  clearIndicator: () => ({
    color: '#0A093F',
    cursor: 'pointer',
  }),
  indicatorSeparator: () => ({
    visible: false,
  }),
  dropdownIndicator: () => ({
    color: '#0A093F',
    cursor: 'pointer',
  }),
  menu: () => ({
    position: 'absolute',
    background: '#E4F4F6',
    border: '2px solid #0A093F',
    borderTop: 0,
    boxSizing: 'border-box',
    padding: '8px 16px 16px 16px',
    width: '100%',
    zIndex: 1,
  }),
  option: () => ({
    borderBottom: '1px solid #0A093F',
    color: '#A43B5C',
    cursor: 'pointer',
    fontWeight: 600,
    padding: '8px',
  }),
};

export default class Apply extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isEditing: false,
      isSubmitted: false,

      application: {},
      resume: undefined,
      page: 0,
    };
  }

  componentDidMount() {
    getRoles().then(roles => {
      if (roles.includes('Applicant')) {
        this.setState({ isEditing: true });
        return getApplication();
      }
      return {};
    }).then(app => {
      this.setState({
        application: app,
        isLoading: false,
      });
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }

  onResumeUpload = event => {
    const file = event.target.files[0];
    this.setState({ resume: file });
  }

  back = () => {
    this.setState(prevState => ({ page: prevState.page - 1 }));
  }

  next = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  }

  submit = app => {
    const { isEditing, resume } = this.state;

    if (resume) {
      app.resumeFilename = resume.name;
    }
    this.setState({ application: app, isLoading: true });

    apply(isEditing, app).then(() => {
      if (resume) {
        uploadResume(resume).then(() => {
          this.setState({ isLoading: false, isSubmitted: true });
        });
      } else {
        this.setState({ isLoading: false, isSubmitted: true });
      }
    }).catch(() => {
      this.setState({ isLoading: false, page: 0 });
      alert('There was an error while submitting your application. If this error persists, please email contact@hackillinois.org');
    });
  }

  personal = ({ values }) => {
    const isValid = values.firstName && values.lastName;

    return (
      <div>
        <p>First Name *</p>
        <Field
          name="firstName"
          placeholder="What is your first name?"
        />

        <p>Last Name *</p>
        <Field
          name="lastName"
          placeholder="What is your last name?"
        />

        <p>Gender</p>
        <SelectField
          styles={customStyles}
          name="gender"
          placeholder="What is your gender?"
          options={[
            { label: 'Female', value: 'FEMALE' },
            { label: 'Male', value: 'MALE' },
            { label: 'Non-Binary', value: 'NONBINARY' },
          ]}
        />

        <br />
        <div className="nav-buttons">
          <div />
          <NextButton onClick={this.next} disabled={!isValid} />
        </div>
      </div>
    );
  }

  educational = ({ values }) => {
    const isValid = values.school && values.major && values.degreePursued && values.graduationYear;

    return (
      <div>
        <p>School *</p>
        <SelectField
          styles={customStyles}
          name="school"
          placeholder="Where do you go to school?"
          options={schools.map(school => ({ label: school, value: school }))}
        />

        <p>Major *</p>
        <SelectField
          styles={customStyles}
          name="major"
          placeholder="What is your major?"
          options={[
            { label: 'Computer Science', value: 'CS' },
            { label: 'Computer Engineering', value: 'CE' },
            { label: 'Electrical Engineering', value: 'EE' },
            { label: 'Other Engineering', value: 'ENG' },
            { label: 'Business', value: 'BUS' },
            { label: 'Liberal Arts and Sciences', value: 'LAS' },
            { label: 'Other', value: 'OTHER' },
          ]}
        />

        <p>Degree *</p>
        <SelectField
          styles={customStyles}
          name="degreePursued"
          placeholder="What degree are you pursuing?"
          options={[
            { label: 'Associate\'s', value: 'ASSOCIATES' },
            { label: 'Bachelor\'s', value: 'BACHELORS' },
            { label: 'Master\'s', value: 'MASTERS' },
            { label: 'PhD', value: 'PHD' },
          ]}
        />

        <p>Graduation Year *</p>
        <SelectField
          styles={customStyles}
          name="graduationYear"
          placeholder="When do you graduate?"
          options={graduationYears.map(year => ({ label: year, value: year }))}
        />

        <div className="nav-buttons">
          <BackButton onClick={this.back} />
          <NextButton onClick={this.next} disabled={!isValid} />
        </div>
      </div>
    );
  }

  professional = () => {
    const { application, resume } = this.state;

    return (
      <div>
        <p>Resume</p>
        <div className="resume-upload">
          <label htmlFor="upload">
            CHOOSE FILE
            <input
              id="upload"
              type="file"
              accept="application/pdf"
              onChange={this.onResumeUpload}
            />
          </label>
          <span>
            {(resume && resume.name) || (application && application.resumeFilename)}
          </span>
        </div>

        <p>Career Interests</p>
        <SelectField
          isMulti
          styles={customStyles}
          name="careerInterest"
          placeholder="You may select multiple options"
          options={[
            { label: 'Full-time', value: 'FULLTIME' },
            { label: 'Internship', value: 'INTERNSHIP' },
          ]}
        />

        <br />

        <div className="nav-buttons">
          <BackButton onClick={this.back} />
          <NextButton onClick={this.next} />
        </div>
      </div>
    );
  }

  experience = ({ values }) => {
    const isValid = values.programmingYears && values.programmingAbility && values.isOSContributor !== '';

    return (
      <div>
        <p>How many years have you been programming? *</p>
        <SelectField
          styles={customStyles}
          name="programmingYears"
          placeholder="Select a number"
          options={[
            { label: '0', value: 0 },
            { label: '1', value: 1 },
            { label: '2', value: 2 },
            { label: '3', value: 3 },
            { label: '4', value: 4 },
            { label: '5', value: 5 },
            { label: '6', value: 6 },
            { label: '7', value: 7 },
            { label: '8', value: 8 },
            { label: '9+', value: 9 },
          ]}
        />

        <p>How would you rate your programming ability? *</p>
        <SelectField
          styles={customStyles}
          name="programmingAbility"
          placeholder="Select a number"
          options={[
            { label: '1: I am a complete beginner', value: 1 },
            { label: '2', value: 2 },
            { label: '3', value: 3 },
            { label: '4: I am comfortable working on an independent project', value: 4 },
            { label: '5', value: 5 },
            { label: '6', value: 6 },
            { label: '7: I am comfortable writing and reviewing code in a professional setting', value: 7 },
            { label: '8', value: 8 },
            { label: '9', value: 9 },
            { label: '10: I am Linus Torvalds', value: 10 },
          ]}
        />

        <p>Have you contributed to Open Source before? *</p>
        <SelectField
          styles={customStyles}
          name="isOSContributor"
          placeholder="Yes/No"
          options={[
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ]}
        />

        <div className="nav-buttons">
          <BackButton onClick={this.back} />
          <NextButton onClick={this.next} disabled={!isValid} />
        </div>
      </div>
    );
  }

  interests = () => (
    <div>
      <p>Which types of projects are you interested in?</p>
      <SelectField
        isMulti
        styles={customStyles}
        name="categoryInterests"
        placeholder="You may select multiple options"
        options={[
          { label: 'App Development', value: 'APPDEV' },
          { label: 'Data Science', value: 'DATASCIENCE' },
          { label: 'Developer Tools', value: 'DEVTOOLS' },
          { label: 'Hardware', value: 'HARDWARE' },
          { label: 'Programming Languages', value: 'LANGUAGES' },
          { label: 'Systems', value: 'SYSTEMS' },
          { label: 'Web Development', value: 'WEBDEV' },
        ]}
      />

      <p>Which languages would you like to work with?</p>
      <SelectField
        isMulti
        styles={customStyles}
        name="languageInterests"
        placeholder="You may select multiple options"
        options={languages.map(language => ({ label: language, value: language }))}
      />

      <div className="nav-buttons">
        <BackButton onClick={this.back} />
        <NextButton onClick={this.next} />
      </div>
    </div>
  );

  event = ({ values }) => {
    const isValid = values.needsBus !== '';

    return (
      <div>
        <p>Do you require bus transportation to the event? *</p>
        <SelectField
          styles={customStyles}
          name="needsBus"
          placeholder="Yes/No"
          options={[
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ]}
        />

        <p>Have you attended HackIllinois previously?</p>
        <SelectField
          styles={customStyles}
          name="hasAttended"
          placeholder="Yes/No"
          options={[
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ]}
        />

        <p>How did you discover HackIllinois?</p>
        <SelectField
          isMulti
          styles={customStyles}
          name="howDiscovered"
          placeholder="You may select multiple options"
          options={[
            { label: 'Friend or Peer', value: 'FRIEND' },
            { label: 'Social Media', value: 'SOCIALMEDIA' },
            { label: 'Other', value: 'OTHER' },
          ]}
        />

        <div className="nav-buttons">
          <BackButton onClick={this.back} />
          <SubmitButton disabled={!isValid} />
        </div>
      </div>
    );
  }

  render() {
    const {
      isLoading,
      isSubmitted,
      application,
      page,
    } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    if (isSubmitted) {
      return (
        <Message
          title="Thank you for your application!"
          text="You will receive a confirmation email shortly. Decisions will be made in late January."
        />
      );
    }

    const titles = [
      'PERSONAL INFO',
      'EDUCATION',
      'PROFESSIONAL INFO',
      'EXPERIENCE',
      'INTERESTS',
      'HACKILLINOIS INFO',
    ];
    const pages = [
      this.personal,
      this.educational,
      this.professional,
      this.experience,
      this.interests,
      this.event,
    ];

    return (
      <div className="apply">
        <div className="progress">
          {titles.map((title, idx) => (
            <div key={title} className="row">
              <img className="pin" src={idx === page ? pinFilled : pinEmpty} alt="pin" />
              <p>{title}</p>
            </div>
          ))}
        </div>

        <div className="application">
          <h3>Application</h3>
          <Formik
            initialValues={application}
            enableReinitialize
            onSubmit={this.submit}
            render={props => <Form>{pages[page](props)}</Form>}
          />
        </div>
      </div>
    );
  }
}