require 'db_client'

class QueriesController < ApplicationController
  include QueriesHelper

  before_filter :authenticate_user!
  # GET /queries
  # GET /queries.json
  def index
    @queries = Query.all(:include => :user)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @queries }
    end
  end

  # GET /queries/new
  # GET /queries/new.json
  def new
    @query = Query.new
    @query.user = current_user
    @query.name = 'untitled'
    @query.value = ''
    @query.save

    # print @query.errors
    redirect_to(edit_query_path(@query, :redirect => params[:redirect]))
  end

  # GET /queries/1/edit
  def edit
    @redirect = param(:redirect, queries_path)

    @query = Query.find(params[:id])
    @connections = Connection.all
  end

  # POST /queries/run
  def run
    if (!request.xhr?)
      raise ActionController::RoutingError.new('Not Found')
    end

    connection = Connection.find request[:connection_id]

    client = DBClient.create connection

    @result = client.query(request[:value])
    @queryError = client.last_query_error
    respond_to do |format|
      format.html {
        render :partial => 'result'
      }
    end
  end

  # GET /queries/data/:token
  def data
    @query = Query.find_by_token!(params[:token])

    if (@query.nil?)
      raise ActionController::RoutingError.new('Not Found')
    end

    client = DBClient.create @query.connection
    @result = client.query(@query.value)

    if (@result)
      data = {
        :result => @result,
        :fields => @result.fields
      }
    else
      data = {
        :error => client.last_query_error.to_s
      }
    end

    respond_to do |format|
      format.html { render json: data, status: :created }
    end
  end

  # PUT /queries/1
  # PUT /queries/1.json
  def update
    @query = Query.find(params[:id])

    if params[:query][:connection_id].present?
      connection = Connection.find(params[:query][:connection_id])
      @query.connection = connection
    end

    respond_to do |format|
      if @query.update_attributes(params[:query])
        if (params[:redirect].nil?)
          redirect_path = queries_path
        else
          redirect_path = params[:redirect]
        end

        format.html { redirect_to redirect_path }
        format.json { head :no_content }
      else
        flash[:errors] = @query.errors
        format.html { redirect_to(edit_query_path()) }
        format.json { render json: @query.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /queries/1
  # DELETE /queries/1.json
  def destroy
    @query = Query.find(params[:id])
    @query.destroy

    respond_to do |format|
      format.html { redirect_to queries_url }
      format.json { head :no_content }
    end
  end
end
